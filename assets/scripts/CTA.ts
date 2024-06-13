import { _decorator, Component, Input, Node } from 'cc';
import super_html_playable from '../super_html/super_html_playable';
const { ccclass, property } = _decorator;
declare var ExitApi;

@ccclass('CTA')
export class CTA extends Component {
    onLoad() {
        super_html_playable.set_google_play_url("");
        super_html_playable.set_app_store_url("");

        if (super_html_playable.is_hide_download()) {
            // this.button_download.active = false;
        }
    }

    start() {
        this.node.on(Input.EventType.TOUCH_START, this.on_click_download, this);
    }

    on_click_game_end() {
        super_html_playable.game_end();
    }

    on_click_download() {
        super_html_playable.download();
        // ExitApi.exit();
    }
}


