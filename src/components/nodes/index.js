import TriggerNode  from './TriggerNode';
import TextNode     from './TextNode';
import ButtonNode   from './ButtonNode';
import ListNode     from './ListNode';
import MediaNode    from './MediaNode';
import DelayNode    from './DelayNode';
import ProductNode  from './ProductNode';
import InputNode     from './InputNode';
import ConditionNode from './ConditionNode';
import CtaUrlNode    from './CtaUrlNode';
import FlowNode      from './FlowNode';

export const nodeTypes = {
  trigger:       TriggerNode,
  text:          TextNode,
  button:        ButtonNode,
  list:          ListNode,
  media:         MediaNode,
  delay:         DelayNode,
  product:       ProductNode,
  collect_input: InputNode,
  condition:     ConditionNode,
  cta_url:       CtaUrlNode,
  flow:          FlowNode,
};
