<script setup lang="ts">
// A short self-test for a recap page: one question, the learner picks an option and sees at once whether it is right and
// why. It is no exercise: nothing is counted or stored. The page says what to do when the answer was wrong.
import { computed, ref } from "vue";
import { feedback } from "./Kurztest.ts";

type Choice = { text: string; correct: boolean; info: string };

const props = defineProps<{
  /** The question. */
  question: string;
  /** The options, exactly one of them correct, each with the reason in info. */
  options: Choice[];
  /** The start of the feedback for a right and a wrong option. */
  right: string;
  wrong: string;
}>();

const picked = ref<number | null>(null);
const id = `kurztest-${Math.abs(props.question.split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7))}`;
const result = computed(() =>
  picked.value === null ? null : feedback(props.options, picked.value, props.right, props.wrong),
);
</script>

<template>
  <fieldset class="kurztest">
    <legend>{{ question }}</legend>
    <label v-for="(o, i) in options" :key="i" class="kurztest-option">
      <input v-model="picked" type="radio" :name="id" :value="i" />
      {{ o.text }}
    </label>
    <p
      class="kurztest-result"
      :class="result ? (result.right ? 'kurztest-right' : 'kurztest-wrong') : ''"
      aria-live="polite"
    >
      {{ result ? result.text : "" }}
    </p>
  </fieldset>
</template>

<style scoped>
.kurztest {
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border: 1px solid var(--page-border);
  border-radius: 0.4rem;
  /* A fieldset is as wide as its content by default; without this it overflows at 360 px (CI usable-at-360px). */
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  overflow-wrap: anywhere;
}

.kurztest legend {
  padding: 0 0.4rem;
  font-weight: 600;
}

.kurztest-option {
  display: block;
  min-height: 44px;
  padding: 0.6rem 0;
  line-height: 1.4;
}

.kurztest-result {
  margin: 0.5rem 0 0;
  min-height: 1.5rem;
}

.kurztest-right {
  color: var(--page-right);
  background: var(--page-right-background);
  padding: 0.4rem 0.6rem;
}

.kurztest-wrong {
  color: var(--page-wrong);
  background: var(--page-wrong-background);
  padding: 0.4rem 0.6rem;
}
</style>
