export const UI_TEXTS = {
  general: {
    userJourneyAreaTitle: 'User Journeys 📜',
    openIssuesAreaTitle: 'Open Issues ✨',
    releasesArea: 'Releases 🏆 (only teaser - any issues here will not be saved)'
  },
  popup: {
    deleteJourneyTitle: 'Delete this journey?',
    deleteJourneyText: 'By deleting this journey, all steps will be deleted as well. Corresponding tickets will be put back into the selection area.',
    deleteStepTitle: 'Delete this step?',
    deleteStepText: 'By deleting this step, corresponding tickets will be put back into the selection area.',
    purgeDBTitle: 'Purge Database? 💥',
    purgeDBText: 'By accepting, all data in IndexedDB will be deleted. This serves as a fallback to clean up any zombie data. Do you want to proceed?',
    fileUploadErrorTitle: 'JSON upload failed',
    fileUploadErrorText: 'The upload of the given JSON file has failed. Please try a valid JSON file.',
  },
  releases: {
    addStepHint: 'Add a step to the journey to receive a slot.'
  }
} as const;
