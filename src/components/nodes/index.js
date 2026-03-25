import TriggerNode  from './TriggerNode';
import TextNode     from './TextNode';
import ButtonNode   from './ButtonNode';
import ListNode     from './ListNode';
import MediaNode    from './MediaNode';
import DelayNode    from './DelayNode';

export const nodeTypes = {
  trigger: TriggerNode,
  text:    TextNode,
  button:  ButtonNode,
  list:    ListNode,
  media:   MediaNode,
  delay:   DelayNode,
};