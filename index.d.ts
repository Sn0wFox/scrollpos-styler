/**
 * @license
 * ========================================================================
 * ScrollPos-Styler v0.7.0
 * https://github.com/acch/scrollpos-styler
 * ========================================================================
 * Copyright 2015 Achim Christ
 * Licensed under MIT (https://github.com/acch/scrollpos-styler/blob/master/LICENSE)
 * ======================================================================== */
declare namespace ScrollPosStyler {
    interface Options {
        scrollOffsetY?: number;
        spsClass?: string;
        classAbove?: string;
        classBelow?: string;
        offsetTag?: string;
    }
    function init(options?: Options): void;
}
export = ScrollPosStyler;
