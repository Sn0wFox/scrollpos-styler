// ======================== ORIGINAL LICENCE NOTICE =======================
/**
 * @license
 * ========================================================================
 * ScrollPos-Styler v0.7.0
 * https://github.com/acch/scrollpos-styler
 * ========================================================================
 * Copyright 2015 Achim Christ
 * Licensed under MIT (https://github.com/acch/scrollpos-styler/blob/master/LICENSE)
 * ======================================================================== */

namespace ScrollPosStyler {

  export interface Options {
    scrollOffsetY?: number;
    spsClass?: string;
    classAbove?: string;
    classBelow?: string;
    offsetTag?: string;
  }
  
  /* ====================
   * private variables
   * ==================== */
  
  let scrollPosY = 0;
  let busy = false;

  // toggle style / class when scrolling below this position (in px)
  let scrollOffsetY = 1;
  
  // class used to apply scrollPosStyler to
  let spsClass = "sps";
  
  // choose elements to apply style / class to
  let elements = document.getElementsByClassName(spsClass);
  
  // style / class to apply to elements when above scroll position
  let classAbove = "sps--abv";
  
  // style / class to apply to elements when below scroll position
  let classBelow = "sps--blw";
  
  // tag to set custom scroll offset per element
  let offsetTag = "data-sps-offset";

  /* ====================
   * private function to check scroll position
   * ==================== */
  function onScroll(): void {
    // ensure that events don't stack
    if (!busy) {
      // find elements to update
      let elementsToUpdate = getElementsToUpdate();

      if (elementsToUpdate.length > 0) {
        // suspend accepting scroll events
        busy = true;

        // asynchronuously update elements
        window.requestAnimationFrame(function() {
          updateElements(elementsToUpdate);
        });
      }
    }
  }

  /* ====================
   * private function to find elements to update
   * ==================== */
  function getElementsToUpdate(): any[] {
    // get current scroll position from window
    scrollPosY = window.pageYOffset;

    let elementsToUpdate: any[] = [];

    // iterate over elements
    // for (let elem of elements) {
    for (let i = 0; elements[i]; ++i) { // chrome workaround
      let element = elements[i];

      // get offset from element, default to global option
      let elScrollOffsetY = element.getAttribute(offsetTag) || scrollOffsetY;

      // check current state of element
      let elOnTop = element.classList.contains(classAbove);

      // if we were above, and are now below scroll position...
      if (elOnTop && scrollPosY > elScrollOffsetY) {
        // remember element
        elementsToUpdate.push({
          element: element,
          addClass: classBelow,
          removeClass: classAbove
        });

        // if we were below, and are now above scroll position...
      } else if (!elOnTop && scrollPosY <= elScrollOffsetY) {
        // remember element
        elementsToUpdate.push({
          element: element,
          addClass: classAbove,
          removeClass: classBelow
        });
      }
    }

    return elementsToUpdate;
  }

  /* ====================
   * private function to update elements
   * ==================== */
  function updateElements(elementsToUpdate: any[]): void {
    // iterate over elements
    // for (let elem of elements) {
    for (let i = 0; elementsToUpdate[i]; ++i) { // chrome workaround
      let map = elementsToUpdate[i];

      // add style / class to element
      map.element.classList.add(map.addClass);
      map.element.classList.remove(map.removeClass);
    }

    // resume accepting scroll events
    busy = false;
  }

  /* ====================
   * public function to initially style elements based on scroll position
   *
   * Options:
   *    scrollOffsetY (number): Default scroll position in px to trigger the style. Default is 1.
   *    spsClass (String): Classname used to determine which elements to style. Default is 'sps'.
   *    classAbove (String): Classname added to the elements when the window is scrolled above the defined position. Default is 'sps--abv'.
   *    classBelow (String): Classname added to the elements when the window is scrolled below the defined position. Default is 'sps--blw'.
   *    offsetTag (String): HTML tag used on the element to specify a scrollOffsetY other than the default.
   *
   * ==================== */
  export function init(options?: Options): void {
    // suspend accepting scroll events
    busy = true;

    // merge options object with global options
    if (options) {
      if (options.spsClass) {
        spsClass = options.spsClass;
        elements = document.getElementsByClassName(spsClass);
      }
      scrollOffsetY = options.scrollOffsetY || scrollOffsetY;
      classAbove = options.classAbove || classAbove;
      classBelow = options.classBelow || classBelow;
      offsetTag = options.offsetTag || offsetTag;
    }

    // find elements to update
    let elementsToUpdate = getElementsToUpdate();

    if (elementsToUpdate.length > 0) {
      // asynchronuously update elements
      window.requestAnimationFrame(function() {
        updateElements(elementsToUpdate);
      });
    } else {
      // resume accepting scroll events
      busy = false;
    }
  }

  /* ====================
   * main initialization
   * ==================== */
  // add initial style / class to elements when DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    // defer initialization to allow browser to restore scroll position
    window.setTimeout(init, 1);
  });

  // register for window scroll events
  window.addEventListener("scroll", onScroll);
}

export = ScrollPosStyler;