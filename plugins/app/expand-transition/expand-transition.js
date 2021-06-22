const ExpandTransitionGenerator = function (context) {
  return {
    beforeEnter(el) {
      el._parent = el.parentNode;
      el._initialStyle = {
        transition: el.style.transition,
        overflow: el.style.overflow,
        ['height']: el.style['height']
      };
    },

    enter(el) {
      const initialStyle = el._initialStyle;
      el.style.setProperty('transition', 'none', 'important'); // Hide overflow to account for collapsed margins in the calculated height

      el.style.overflow = 'hidden';
      const offset = `${el['offsetHeight']}px`;
      el.style['height'] = '0';
      void el.offsetHeight; // force reflow

      el.style.transition = initialStyle.transition;

      if ('' && el._parent) {
        el._parent.classList.add('');
      }

      requestAnimationFrame(() => {
        el.style['height'] = offset;
      });
    },

    afterEnter(el) {
      resetStyles(el)

      context.data.on['after-enter']()
    },
    enterCancelled: resetStyles,

    leave(el) {
      el._initialStyle = {
        transition: '',
        overflow: el.style.overflow,
        ['height']: el.style['height']
      };
      el.style.overflow = 'hidden';
      el.style['height'] = `${el['offsetHeight']}px`;
      void el.offsetHeight; // force reflow

      requestAnimationFrame(() => el.style['height'] = '0');
    },

    afterLeave,

    leaveCancelled: afterLeave
  };

  function afterLeave(el) {
    if ('' && el._parent) {
      el._parent.classList.remove('');
    }

    resetStyles(el);

    context.data.on['after-leave']()
  }

  function resetStyles(el) {
    const size = el._initialStyle['height'];
    el.style.overflow = el._initialStyle.overflow;
    if (size != null) el.style['height'] = size;
    delete el._initialStyle;
  }
}
//# sourceMappingURL=expand-transition.js.map





import mergeData from './mergeData';

const VExpandTransition = {
  name: 'expand-transition',

  functional: true,

  props: {
    mode: {
      type: String,
      default: 'in-out'
    }
  },

  render(createElement, context) {
    return createElement('transition', mergeData(context.data, {
      
      props: {
        name: 'expand-transition',
      },

      on: ExpandTransitionGenerator(context)

    }), context.children);
  }

}





import Vue from 'vue'

Vue.component('ExpandTransition', VExpandTransition)