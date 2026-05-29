import TriggerNode  from './TriggerNode';
import TextNode     from './TextNode';
import ButtonNode   from './ButtonNode';
import ListNode     from './ListNode';
import MediaNode    from './MediaNode';
import DelayNode    from './DelayNode';
import ProductNode  from './ProductNode';

export const nodeTypes = {
  trigger: TriggerNode,
  text:    TextNode,
  button:  ButtonNode,
  list:    ListNode,
  media:   MediaNode,
  delay:   DelayNode,
  product: ProductNode,
};