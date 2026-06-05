import Workflow from '../models/Workflow.js';
import Contact  from '../models/Contact.js';
import { sendMessage } from './messageSender.js';
import Message from "../models/Message.js";

// ── Condition evaluator ─────────────────────────────────────────────────────
const evalCondition = (node, variables) => {
  const { variable = '', operator = 'equals', value = '' } = node.data || {};
  const actual = (variables?.get?.(variable) || variables?.[variable] || '').toString().toLowerCase().trim();
  const target = (value || '').toLowerCase().trim();
  switch (operator) {
    case 'equals':       return actual === target;
    case 'not_equals':   return actual !== target;
    case 'contains':     return actual.includes(target);
    case 'not_contains': return !actual.includes(target);
    case 'starts_with':  return actual.startsWith(target);
    case 'ends_with':    return actual.endsWith(target);
    case 'greater_than': return parseFloat(actual) > parseFloat(target);
    case 'less_than':    return parseFloat(actual) < parseFloat(target);
    case 'is_set':       return actual !== '' && actual !== 'undefined';
    case 'is_not_set':   return actual === '' || actual === 'undefined';
    default:             return false;
  }
};

// ── Validation helpers ──────────────────────────────────────────────────────
const validators = {
  phone:  v => /^[\d\s\+\-\(\)]{7,15}$/.test(v.trim()),
  email:  v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  number: v => !isNaN(Number(v.trim())) && v.trim() !== '',
  text:   () => true,
};

// ── Variable interpolation ──────────────────────────────────────────────────
const interpolate = (text, variables) => {
  if (!text || !variables) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => variables.get?.(key) ?? variables[key] ?? `{{${key}}}`);
};

export const executeWorkflow = async (userId, incomingText, fromNumber, contactId) => {
  // ── 0. Load contact (needed for pending-input state + variables) ───────────
  const contact = await Contact.findById(contactId);
  if (!contact) return;

  // ── 1. RESUME: contact is awaiting collect_input answer ────────────────────
  if (contact.awaitingInput && contact.activeWorkflowId && contact.currentNodeId) {
    const workflow = await Workflow.findById(contact.activeWorkflowId);
    if (workflow) {
      const varName    = contact.awaitingInputVar || 'input';
      const inputType  = contact.awaitingInputType || 'text';
      const retryMsg   = contact.awaitingRetryMsg;
      const validate   = validators[inputType] || validators.text;

      // Validate the answer
      if (!validate(incomingText)) {
        // Send retry message
        const retryText = retryMsg || `Please enter a valid ${inputType}.`;
        await sendMessage(userId, fromNumber, { type: 'text', text: retryText });
        return; // keep awaitingInput = true
      }

      // Store variable
      contact.variables.set(varName, incomingText.trim());
      contact.awaitingInput    = false;
      contact.awaitingInputVar = null;
      await contact.save();

      // Continue workflow from next node after the collect_input node
      const outgoing = workflow.edges.filter(e => e.source === contact.currentNodeId);
      if (outgoing.length) {
        await executeFromNode(workflow, outgoing[0].target, incomingText, fromNumber, userId, contactId, contact);
      }
      return; // done — don't check other workflows
    }
  }

  // ── 2. KEYWORD MATCH: find and start a workflow ────────────────────────────
  const workflows = await Workflow.find({ userId, isActive: true });

  for (const workflow of workflows) {
    const triggerNode = workflow.nodes.find(n => n.type === 'trigger');
    if (!triggerNode || !triggerNode.data?.keyword) continue;

    const { keyword, matchType } = triggerNode.data;
    const text = (incomingText || '').toLowerCase().trim();
    const keywordsArray = keyword.split(',').map(k => k.toLowerCase().trim());

    const isKeywordMatch = keywordsArray.some(kw =>
      matchType === 'exact' ? text === kw : text.includes(kw)
    );

    const continuationEdge = workflow.edges.find(e => e.sourceHandle === incomingText.trim());

    if (!isKeywordMatch && !continuationEdge) continue;

    // Reset any stale awaiting-input state when a new keyword fires
    if (contact.awaitingInput) {
      contact.awaitingInput    = false;
      contact.awaitingInputVar = null;
      await contact.save();
    }

    if (isKeywordMatch) {
      await executeFromNode(workflow, triggerNode.id, incomingText, fromNumber, userId, contactId, contact);
    } else {
      await executeFromNode(workflow, continuationEdge.source, incomingText, fromNumber, userId, contactId, contact);
    }
    break;
  }
};

const executeFromNode = async (workflow, startNodeId, incomingText, fromNumber, userId, contactId, contact) => {
  const nodeMap = Object.fromEntries(workflow.nodes.map(n => [n.id, n]));
  // Re-fetch contact if not passed (keep variables fresh)
  if (!contact) contact = await Contact.findById(contactId);
  const vars = contact?.variables || {};
  let currentId = startNodeId;

  while (true) {
    const outgoingEdges = workflow.edges.filter(e => e.source === currentId);
    if (!outgoingEdges.length) break;

    let nextEdge;
    if (outgoingEdges.length === 1) {
      nextEdge = outgoingEdges[0];
    } else {
      nextEdge = outgoingEdges.find(e => e.sourceHandle === incomingText.trim());
      if (!nextEdge) {
        nextEdge = outgoingEdges[0]; // Fallback to first edge if no handle matches
      }
    }

    const nextNode = nodeMap[nextEdge.target];
    if (!nextNode) break;

    // ── Handle condition node ──
    if (nextNode.type === 'condition') {
      const result = evalCondition(nextNode, vars);
      const handle = result ? 'true' : 'false';
      console.log(`🔀 [Condition] ${nextNode.data?.variable} ${nextNode.data?.operator} "${nextNode.data?.value}" → ${result ? 'TRUE' : 'FALSE'}`);
      // Find the edge for this branch (true/false handle)
      const branchEdge = workflow.edges.find(e => e.source === nextNode.id && e.sourceHandle === handle)
                      || workflow.edges.find(e => e.source === nextNode.id); // fallback
      if (!branchEdge) break;
      const branchNode = nodeMap[branchEdge.target];
      if (!branchNode) break;
      currentId = branchNode.id;
      continue; // don't send condition node as a message
    }

    // ── Handle delay node ──
    if (nextNode.type === 'delay') {
      await sleep(nextNode.data.delayMinutes * 60 * 1000);
      currentId = nextNode.id;
      continue;
    }

    // ── Handle collect_input node ──
    if (nextNode.type === 'collect_input') {
      const { question, variableName, inputType, retryMessage } = nextNode.data;
      if (question) {
        // Send the question to the user
        const questionText = interpolate(question, vars);
        await sendMessage(userId, fromNumber, { type: 'text', text: questionText });
      }
      // Save awaiting-input state on the contact
      if (contact) {
        contact.awaitingInput     = true;
        contact.awaitingInputVar  = variableName || 'input';
        contact.awaitingInputType = inputType || 'text';
        contact.awaitingRetryMsg  = retryMessage || null;
        contact.activeWorkflowId  = workflow._id;
        contact.currentNodeId     = nextNode.id;
        await contact.save();
      }
      break; // Stop — wait for user's reply
    }

    // ── Handle message node ──
    if (nextNode.type === 'message') {
      // Convert Mongoose subdocument → plain JS object
      let msgData = nextNode.data.message?.toObject
        ? nextNode.data.message.toObject()
        : nextNode.data.message;
      if (!msgData) { currentId = nextNode.id; continue; }

      // ── Variable interpolation: replace {{var}} in all text fields ──────────
      if (msgData.text)        msgData = { ...msgData, text:        interpolate(msgData.text,        vars) };
      if (msgData.buttonBody)  msgData = { ...msgData, buttonBody:  interpolate(msgData.buttonBody,  vars) };
      if (msgData.listBody)    msgData = { ...msgData, listBody:    interpolate(msgData.listBody,    vars) };
      if (msgData.mediaCaption)msgData = { ...msgData, mediaCaption:interpolate(msgData.mediaCaption,vars) };
      if (msgData.body)        msgData = { ...msgData, body:        interpolate(msgData.body,        vars) };

      console.log(`\n🔁 [Workflow] Executing node: ${nextNode.id}`);
      console.log(`📨 [Workflow] msgData:`, JSON.stringify(msgData, null, 2));

      try {
        // 1. Send via Meta API
        const result = await sendMessage(userId, fromNumber, msgData);
        const metaMessageId = result?.metaMessageId || null;

        // 2. Build message record with type-specific fields
        let messageRecord = {
          userId,
          contactId,
          from: 'bot',
          type: msgData.type === 'text' ? 'text' : 'interactive',
          messageId: metaMessageId,   // wamid — required for delivery/read status updates via webhook
          status: 'sent',
          isReadByAdmin: true,
          timestamp: new Date(),
        };

        // 3. Store complete message data based on type
        if (msgData.type === 'text') {
          messageRecord.text = msgData.text;
        } 
        else if (msgData.type === 'button') {
          messageRecord.text = msgData.buttonBody || 'Button Message';
          messageRecord.metadata = {
            type: 'button',
            header: msgData.buttonHeader || null,
            footer: msgData.buttonFooter || null,
            buttons: msgData.buttons, // Store complete buttons array with id, title
          };
        } 
        else if (msgData.type === 'list') {
          messageRecord.text = msgData.listBody || 'List Message';
          messageRecord.metadata = {
            type: 'list',
            header: msgData.listHeader || null,
            footer: msgData.listFooter || null,
            buttonText: msgData.listButtonText || 'View options',
            sections: msgData.sections, // Store complete sections with rows (id, title, description)
          };
        } 
        else if (msgData.type === 'media') {
          messageRecord.text = msgData.mediaCaption || 'Media Message';
          messageRecord.metadata = {
            type: 'media',
            mediaType: msgData.mediaType,
            mediaUrl: msgData.mediaUrl,
          };
        }
        else if (msgData.type === 'product') {
          messageRecord.text = msgData.body || 'Product Message';
          messageRecord.metadata = {
            type: 'product',
            catalogId: msgData.catalogId,
            productRetailerId: msgData.productRetailerId,
          };
        }
        else if (msgData.type === 'product_list') {
          messageRecord.text = msgData.body || 'Product List Message';
          messageRecord.metadata = {
            type: 'product_list',
            catalogId: msgData.catalogId,
            header: msgData.header,
            sections: msgData.productSections || msgData.sections,
          };
        }

        // 4. Save to Message DB
       try {
    const savedMsg = await Message.create(messageRecord);
    console.log("✅ Message saved successfully:", savedMsg._id);
} catch (dbErr) {
    console.error("❌ Database Save Error:", dbErr.message);
    console.error("Data attempted:", JSON.stringify(messageRecord, null, 2));
}

      } catch (err) {
        console.error('🔥 Send error:', err.message);
      }

      currentId = nextNode.id;

      // Stop loop if it's an interactive message requiring user input
      // Fix #5: product and product_list also need user interaction — break here too
      if (['button', 'list', 'product', 'product_list'].includes(msgData.type)) {
        break;
      }
      continue;
    }

    currentId = nextNode.id;
  }
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));