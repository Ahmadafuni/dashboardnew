import { atom } from "recoil";

export const rejectModal = atom({
  key: "rejectModal",
  default: false,
});

export const currentVariantId = atom({
  key: "currentVariantId",
  default: 0,
});

export const currentTrackingId = atom({
  key: "currentTrackingId",
  default: 0,
});

export const pauseUnpauseModal = atom({
  key: "pauseUnpauseModal",
  default: false,
});

export const cuttingSendConfirmationModal = atom({
  key: "cuttingSendConfirmationModal",
  default: false,
});

export const othersSendConfirmationModal = atom({
  key: "othersSendConfirmationModal",
  default: false,
});

export const completeModal = atom({
  key: "completeModal",
  default: false,
});
