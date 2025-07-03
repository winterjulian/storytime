export const UI_TEXTS = {
  general: {
    userJourneyAreaTitle: 'User Journeys 📜',
    openIssuesAreaTitle: 'Open Issues ✨',
    releasesArea: 'Releases 🏆'
  },
  popup: {
    deleteJourneyTitle: 'Delete this journey?',
    deleteJourneyText: 'By deleting this journey, all steps will be deleted as well. Corresponding tickets will be put back into the selection area.',
    deleteStepTitle: 'Delete this step?',
    deleteStepText: 'By deleting this step, corresponding tickets will be put back into the selection area.',
    purgeDBTitle: 'Purge Database? 💥',
    purgeDBText: 'By accepting, all data in the indexedDB will be deleted. This is meant as a fall back for prevent zombie data. Proceed?',
  },
  releases: {
    addStepHint: 'Add a step to the journey to receive a slot.'
  }
} as const;
