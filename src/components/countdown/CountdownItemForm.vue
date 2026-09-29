<script setup lang="ts">
import { computed, ref } from "vue";
import CountdownFinishFields from "@/components/countdown/CountdownFinishFields.vue";
import ItemFormFrame from "@/components/playlist/ItemFormFrame.vue";
import ItemThemeField from "@/components/playlist/ItemThemeField.vue";
import Input from "@/components/ui/Input.vue";
import Select from "@/components/ui/Select.vue";
import {
  COUNTDOWN_TRANSITION_OPTIONS,
  DEFAULT_FINAL_MESSAGE_SECONDS,
} from "@/core/constants/countdown";
import { ThemeCategories } from "@/core/state/theme/themeCategories";
import { useThemeStore } from "@/core/state/theme/themeStore";
import type {
  CountdownFinishAction,
  CountdownTransition,
  PlaylistItem, SlideCountdown } from "@/core/types/playlist";
import type { SlidesTheme, ThemeBinding } from "@/core/types/theme";
import ItemThemeModal from "@/modals/ItemTheme/ItemThemeModal.vue";
import { openModal } from "@/modals/openModal";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Countdown form: name + event time + theme. Used to
 * create (without `item`) and to edit (with `item`, already holding the current values).
 */
const props = withDefaults(
  defineProps<{ item?: PlaylistItem; submitLabel?: string }>(),
  { item: undefined },
);

const emit = defineEmits<{
  submit: [
    name: string,
    countdown: SlideCountdown,
    themeBinding: ThemeBinding | null,
    customTheme: SlidesTheme | null,
  ];
  cancel: [];
}>();

const themeCtx = useThemeStore();
const THEME_CATEGORY = ThemeCategories.forItemType("countdown");

const time = ref(props.item?.slides[0]?.countdown?.time ?? "");
const transition = ref<CountdownTransition>(props.item?.slides[0]?.countdown?.transition ?? "none");
const textBefore = ref(props.item?.slides[0]?.countdown?.textBefore ?? "");
const textAfter = ref(props.item?.slides[0]?.countdown?.textAfter ?? "");
const finalMessage = ref(props.item?.slides[0]?.countdown?.finalMessage ?? "");
const finalMessageSeconds = ref(
  props.item?.slides[0]?.countdown?.finalMessageSeconds ?? DEFAULT_FINAL_MESSAGE_SECONDS,
);
const finishAction = ref<CountdownFinishAction>(
  props.item?.slides[0]?.countdown?.finishAction ?? "none",
);
const removeWhenDone = ref(props.item?.slides[0]?.countdown?.removeWhenDone ?? false);
const themeBinding = ref<ThemeBinding | null>(
  props.item?.themeBinding ?? themeCtx.actions.resolveDefaultBinding(THEME_CATEGORY),
);
/** The item's custom theme: independent of the active binding, never reset when switching themes. */
const customTheme = ref<SlidesTheme | null>(props.item?.customTheme ?? null);

const resolvedTheme = computed(() =>
  themeCtx.actions.resolveThemeBinding(themeBinding.value),
);

/** Base for editing the custom theme: what already exists, never the currently active theme. */
const personalThemeBase = computed(() => customTheme.value ?? themeCtx.state.currentTheme);

const submit = (name: string) =>
  emit(
    "submit",
    name,
    {
      time: time.value,
      transition: transition.value,
      textBefore: textBefore.value.trim(),
      textAfter: textAfter.value.trim(),
      finalMessage: finalMessage.value.trim(),
      finalMessageSeconds: finalMessageSeconds.value,
      finishAction: finishAction.value,
      removeWhenDone: removeWhenDone.value,
    },
    themeBinding.value,
    customTheme.value,
  );

const changeTheme = () => {
  openModal(ItemThemeModal, {
    category: THEME_CATEGORY,
    currentTheme: personalThemeBase.value,
    currentBinding: themeBinding.value,
    onApply: (binding: ThemeBinding) => {
      themeBinding.value = binding;
      if (binding.mode === "custom") customTheme.value = binding.theme;
    },
  });
};
</script>

<template>
  <ItemFormFrame
    :can-submit="!!time"
    :initial-name="props.item?.name"
    :submit-label="props.submitLabel ?? t('common.actions.create')"
    @submit="submit"
    @cancel="emit('cancel')"
  >
    <Input
      id="countdown-time"
      v-model="time"
      type="time"
      :label="t('components.countdown.eventTime')"
      class="max-w-48"
    />

    <Select
      v-model="transition"
      :options="COUNTDOWN_TRANSITION_OPTIONS"
      :label="t('components.countdown.numberTransition')"
    />

    <Input
      id="countdown-text-before"
      v-model="textBefore"
      :label="t('components.countdown.textBefore')"
      :placeholder="t('components.countdown.textBeforeExample')"
      :maxlength="80"
    />
    <Input
      id="countdown-text-after"
      v-model="textAfter"
      :label="t('components.countdown.textAfter')"
      :placeholder="t('components.countdown.textAfterExample')"
      :maxlength="80"
    />
    <CountdownFinishFields
      v-model:final-message="finalMessage"
      v-model:final-message-seconds="finalMessageSeconds"
      v-model:finish-action="finishAction"
      v-model:remove-when-done="removeWhenDone"
    />

    <ItemThemeField :theme="resolvedTheme" @change-theme="changeTheme" />
  </ItemFormFrame>
</template>
