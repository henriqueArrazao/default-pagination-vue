<template>
  <ul
    class="default-pagination disable-select"
    :class="{ blurred: blurred }"
    :style="cssConfig"
  >
    <li
      @click="emitPageClickEvent(1)"
      :class="[
        { disabled: !hasPrevious },
        { 'colored-controller': coloredControllers && hasPrevious }
      ]"
      v-if="!noFirstLast"
      id="first"
    >
      <slot name="first"
        ><font-awesome-icon
          :icon="icons[0]"
          class="last-icons"
          v-if="!noFirstLastIcon"
        />
        {{ !noFirstLastText ? textFirst : '' }}</slot
      >
    </li>
    <li
      @click="emitPageClickEvent(modelValue - 1, hasPrevious)"
      :class="[
        { disabled: !hasPrevious },
        { 'colored-controller': coloredControllers && hasPrevious }
      ]"
      v-if="!noPrevNext"
      id="previous"
    >
      <slot name="previous">
        <font-awesome-icon :icon="icons[1]" />
      </slot>
    </li>
    <li
      v-for="(txt, i) in pagesShown"
      :key="txt + i"
      :class="{
        'current-page': txt == modelValue,
        'not-clickable': isNaN(txt)
      }"
      @click="emitPageClickEvent(txt, !isNaN(txt))"
      id="square"
    >
      {{ txt }}
    </li>
    <li
      @click="emitPageClickEvent(modelValue + 1, hasNext)"
      :class="[
        { disabled: !hasNext },
        { 'colored-controller': coloredControllers && hasNext }
      ]"
      v-if="!noPrevNext"
      id="next"
    >
      <slot name="next">
        <font-awesome-icon :icon="icons[2]" />
      </slot>
    </li>
    <li
      :class="[
        { disabled: !hasNext },
        { 'colored-controller': coloredControllers && hasNext }
      ]"
      @click="emitPageClickEvent(totalPages)"
      v-if="!noFirstLast"
      id="last"
    >
      <slot name="last"
        >{{ !noFirstLastText ? textLast : '' }}
        <font-awesome-icon
          :icon="icons[3]"
          class="last-icons"
          v-if="!noFirstLastIcon"
      /></slot>
    </li>
  </ul>
</template>

<script>
import { toRefs, ref, computed, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
  faChevronLeft,
  faChevronRight,
  faAngleDoubleLeft,
  faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';

export default {
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      icons: [
        faAngleDoubleLeft,
        faChevronLeft,
        faChevronRight,
        faAngleDoubleRight
      ]
    };
  },
  emits: ['update:modelValue', 'page-click'],
  props: {
    totalPages: {
      type: Number,
      default: 1
    },
    modelValue: {
      type: Number,
      default: 1
    },
    maxSquares: {
      type: Number,
      default: 7
    },
    noFirstLastIcon: {
      type: Boolean,
      default: false
    },
    noFirstLastText: {
      type: Boolean,
      default: false
    },
    noFirstLast: {
      type: Boolean,
      default: false
    },
    textFirst: {
      type: String,
      default: 'First'
    },
    textLast: {
      type: String,
      default: 'Last'
    },
    noPrevNext: {
      type: Boolean,
      default: false
    },
    modeSimple: {
      type: Boolean,
      default: false
    },
    modeDefault: {
      type: Boolean,
      default: true
    },
    modeFancy: {
      type: Boolean,
      default: false
    },
    primaryColor: {
      type: String,
      default: '#4c4c4c'
    },
    secondaryColor: {
      type: String,
      default: 'white'
    },
    shadowColor: {
      type: String,
      default: '#565656'
    },
    disabledColor: {
      type: String,
      default: '#808080ad'
    },
    coloredControllers: {
      type: Boolean,
      default: false
    },
    notInheritFont: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const { modelValue, totalPages, maxSquares } = toRefs(props);

    const totalPagesC = computed(function() {
      const total = +totalPages.value;
      return !total || isNaN(total) || total < 1 ? 1 : total;
    });

    validatePages();
    watch([modelValue, totalPages], validatePages);

    function validatePages() {
      if (isNaN(modelValue.value) || modelValue.value < 1) changeModelValue(1);
      else if (modelValue.value > totalPagesC.value) {
        changeModelValue(totalPagesC.value);
      }
    }

    const blurred = ref(false);
    function emitPageClickEvent(newPage, condition) {
      if (condition === false || newPage === modelValue.value) return;

      if (blurred.value) return;
      const lastValue = modelValue.value;
      changeModelValue(newPage);
      const params = {
        blurState: () => {
          blurred.value = !!blur;
        },
        cancelChange: () => {
          changeModelValue(lastValue);
          blurred.value = false;
        },
        done: () => {
          blurred.value = false;
        },
        newPage,
        totalPages: totalPagesC.value
      };
      context.emit('page-click', params);
    }

    function changeModelValue(newValue) {
      context.emit('update:modelValue', newValue);
    }

    const maxSquaresC = computed(() => {
      if (isNaN(maxSquares.value)) return 7;
      return +maxSquares.value;
    });

    const pagesShown = computed(function() {
      let initialPage = 1;
      var total = totalPagesC.value;
      const squares = maxSquaresC.value;

      if (totalPagesC.value > squares) {
        total = squares;
        initialPage =
          modelValue.value - total / 2 + (total % 2 === 0 ? 1 : 0.5);
        if (initialPage < 1) initialPage = 1;
        else if (initialPage + total > totalPagesC.value)
          initialPage = totalPagesC.value - total + 1;
      }

      const pagesArray = Array.apply(null, { length: total }).map((e, i) => {
        return initialPage + i;
      });

      if (props.modeSimple) return pagesArray;

      if (props.modeFancy) {
        if (pagesArray[0] > 1) {
          pagesArray[0] = 1;
          pagesArray[1] = '...';
        }
        if (!pagesArray.includes(totalPagesC.value)) {
          pagesArray[total - 2] = '...';
          pagesArray[total - 1] = totalPagesC.value;
        }
        return pagesArray;
      }

      if (pagesArray[0] > 1) pagesArray[0] = '...';
      if (!pagesArray.includes(totalPagesC.value))
        pagesArray[total - 1] = '...';

      return pagesArray;
    });

    const hasPrevious = computed(() => {
      return modelValue.value > 1;
    });
    const hasNext = computed(() => {
      return modelValue.value < totalPagesC.value;
    });

    const cssConfig = computed(function() {
      return {
        '--primary-color-pagination': props.primaryColor,
        '--secondary-color-pagination': props.secondaryColor,
        '--shadow-color-pagination': props.shadowColor,
        '--disabled-color-pagination': props.disabledColor,
        'font-family': props.notInheritFont
          ? '"Commissioner", sans-serif'
          : 'inherit'
      };
    });

    return {
      emitPageClickEvent,
      totalPagesC,
      blurred,
      hasPrevious,
      hasNext,
      pagesShown,
      cssConfig
    };
  }
};
</script>

<style scoped src="./style.css"></style>
