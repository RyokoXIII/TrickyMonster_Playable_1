import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemController')
export class ItemController extends Component {

    @property(Node)
    chili: Node = null;

    start() {
       
    }

    update(deltaTime: number) {

    }
}


