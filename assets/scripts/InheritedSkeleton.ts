import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('InheritedSkeleton')
export class InheritedSkeleton extends sp.Skeleton {
    public updateWorldTransform(): void {
        super.updateWorldTransform();
    }
}


