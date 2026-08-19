/**
 * translations.ts — Internationalization (i18n) translations
 * 
 * Supports English (en) and Arabic (ar) languages
 * Used by the Settings screen and throughout the app
 */

export type Language = 'en' | 'ar'

export interface Translations {
  sidebar: {
    home: string
    explore: string
    messages: string
    friendRequests: string
    notifications: string
    settings: string
    logo: string
    create: string
    createPost: string
  }
  header: {
    searchPlaceholder: string
    notifications: string
  }
  settings: {
    title: string
    subtitle: string
    categories: {
      appearance: string
      privacy: string
    }
    appearance: {
      title: string
      subtitle: string
      theme: {
        label: string
        light: string
        dark: string
        system: string
      }
      language: {
        label: string
        english: string
        arabic: string
      }
    }
    privacy: {
      title: string
      subtitle: string
      blockedUsers: {
        title: string
        empty: string
        unblock: string
      }
    }
  }
  common: {
    cancel: string
    save: string
    loading: string
    retry: string
    delete: string
    confirm: string
    close: string
    share: string
    edit: string
    remove: string
    add: string
    search: string
    seeMore: string
    noResults: string
  }
  auth: {
    login: {
      title: string
      subtitle: string
      emailLabel: string
      passwordLabel: string
      submit: string
      submitting: string
      orContinueWith: string
      noAccount: string
      signUpLink: string
    }
    register: {
      title: string
      subtitle: string
      firstNameLabel: string
      lastNameLabel: string
      emailLabel: string
      cityLabel: string
      countryLabel: string
      genderLabel: string
      genderMale: string
      genderFemale: string
      passwordLabel: string
      submit: string
      submitting: string
      haveAccount: string
      signInLink: string
    }
  }
  home: {
    addStory: string
    createPlaceholder: string
    launch: string
    launching: string
    loadingFeed: string
    errorLoadingFeed: string
    emptyFeed: string
    savePost: string
    hidePost: string
    sharePost: string
    editPost: string
    postSaved: string
    postAlreadySaved: string
    postHidden: string
    linkCopied: string
    writeComment: string
    noComments: string
  }
  profile: {
    postsCount: string
    friendsCount: string
    editProfile: string
    share: string
    tabPortfolio: string
    tabSaved: string
    emptySaved: string
    emptyPosts: string
    avatarUpdated: string
    avatarUpdateFailed: string
    avatarUploadFailed: string
    removedFromSaved: string
    unsaveFailed: string
  }
  messages: {
    title: string
    group: string
    loadError: string
    noConversations: string
    startConversation: string
    photoPreview: string
    noMessagesPreview: string
    members: string
    selectConversation: string
    directMessage: string
    noMessagesYet: string
    typeMessage: string
    uploadImageFailed: string
    sendFailed: string
    groupInfo: string
    unnamedGroup: string
    membersHeader: string
    allFriendsInGroup: string
    memberAdded: string
    addMemberFailed: string
    you: string
    admin: string
    confirmLeave: string
    leaveGroup: string
    leftGroup: string
    leaveFailed: string
    memberRemoved: string
    removeFailed: string
    newMessage: string
    groupNamePlaceholder: string
    noFriendsToMessage: string
    createGroup: string
    startConversationBtn: string
    groupCreated: string
    conversationStarted: string
    startConversationFailed: string
  }
  notifications: {
    title: string
    subtitle: string
    markAllRead: string
    tabDirect: string
    tabDirectDesc: string
    tabActivity: string
    tabActivityDesc: string
    loadError: string
    allCaughtUp: string
    today: string
    earlier: string
    someone: string
    reactedToComment: string
    reactedToPost: string
    commentedOnPost: string
    sentFriendRequest: string
    acceptedFriendRequest: string
    mentionedYou: string
    sentMessageWithPreview: string
    sentMessage: string
    interacted: string
    minutesAgo: string
    hoursAgo: string
    daysAgo: string
  }
  search: {
    title: string
    subtitle: string
    placeholder: string
    search: string
    clear: string
    recentSearches: string
    clearAll: string
    searchFailed: string
    searchFailedGeneric: string
    noUserFound: string
    noUserFoundDesc: string
    viewProfile: string
    role: string
    memberSince: string
    searchForUsers: string
    searchForUsersDesc: string
    userName: string
    verified: string
  }
  friendRequests: {
    title: string
    unknownUser: string
    accept: string
    decline: string
    noPending: string
  }
  createPost: {
    title: string
    placeholder: string
    visibilityUniversal: string
    visibilityUniversalDesc: string
    visibilityInnerCircle: string
    visibilityInnerCircleDesc: string
    visibilityPrivate: string
    visibilityPrivateDesc: string
    whoCanSee: string
    schedule: string
    scheduled: string
    schedulePostLabel: string
    schedulePlaceholder: string
    discard: string
    postNow: string
    launching: string
    needContentWarning: string
    postScheduled: string
    invalidScheduledData: string
    scheduleFailed: string
    postCreated: string
    sessionExpired: string
    postTooLarge: string
    serverError: string
    filesUploaded: string
    uploadFailedGeneric: string
    editTitle: string
    saveChanges: string
    saving: string
    postUpdated: string
    updateFailed: string
    loadingPost: string
    currentMedia: string
    addNewMedia: string
    feelingLabel: string
    feelingPlaceholder: string
    locationLabel: string
    locationPlaceholder: string
    needContentWarningUpdate: string
    permissionDenied: string
    postNotFound: string
    invalidPostSettings: string
  }
  createStory: {
    title: string
    invalidFileType: string
    addContentWarning: string
    publishing: string
    published: string
    sessionExpired: string
    noPermission: string
    endpointNotFound: string
    publishFailed: string
    invalidContent: string
    visibilityPublic: string
    visibilityFriends: string
    visibilityOnlyMe: string
    visibilityLabel: string
    expiresIn24h: string
    statusPlaceholder: string
    uploadMedia: string
    shareNow: string
    sharing: string
  }
  storiesScreen: {
    failedToLoad: string
    errorOccurred: string
    goBack: string
    noStoriesYet: string
    anonymous: string
    recent: string
    noContent: string
    deleteConfirm: string
    deleted: string
    noPermissionDelete: string
    notFoundOrDeleted: string
    deleteFailed: string
  }
  createGroupModal: {
    title: string
    imageTooLarge: string
    selectImageFile: string
    changePhoto: string
    addPhoto: string
    groupNameLabel: string
    groupNamePlaceholder: string
    charactersCount: string
    descriptionLabel: string
    descriptionPlaceholder: string
    addMembers: string
    noFriendsMatching: string
    noFriendsToAdd: string
    searchFriends: string
    nameRequired: string
    nameTooShort: string
    nameTooLong: string
    selectAtLeastOne: string
    avatarUploadFailed: string
    groupCreated: string
    createFailed: string
    unexpectedError: string
    creating: string
    createGroup: string
  }
  editProfile: {
    title: string
    subtitle: string
    save: string
    coverPhoto: string
    uploading: string
    clickToUploadCover: string
    coverHint: string
    profilePicture: string
    uploadPhoto: string
    remove: string
    avatarHint: string
    nameLabel: string
    namePlaceholder: string
    usernameLabel: string
    usernamePlaceholder: string
    bioLabel: string
    bioPlaceholder: string
    charactersOf160: string
    cityLabel: string
    cityPlaceholder: string
    countryLabel: string
    countryPlaceholder: string
    genderLabel: string
    genderMale: string
    genderFemale: string
    genderOther: string
    genderPreferNotToSay: string
    cancel: string
    saveChanges: string
    invalidImageFile: string
    imageTooLarge10: string
    readImageFailed: string
    avatarUploaded: string
    avatarUploadFailed: string
    coverUploaded: string
    coverUploadFailed: string
    nameRequired: string
    usernameRequired: string
    profileUpdated: string
    updateFailed: string
  }
  postDetail: {
    backToFeed: string
    editPost: string
    deletePost: string
    noActionsAvailable: string
    share: string
    saved: string
    save: string
    addThoughtsPlaceholder: string
    theConversation: string
    noComments: string
    anonymous: string
    like: string
    reply: string
    replyToPlaceholder: string
    postNotFound: string
    goBack: string
    removedFromSaved: string
    unsaveFailed: string
    postSaved: string
    postAlreadySaved: string
    saveFailed: string
    linkCopiedAlert: string
    postDeleted: string
    deleteFailed: string
  }
  friendsList: {
    title: string
    noFriendsYet: string
    unfriend: string
  }
  userActions: {
    unblock: string
    confirmBlock: string
    cancel: string
    confirmUnfriend: string
    friends: string
    unfriendAction: string
    block: string
    accept: string
    decline: string
    requestSent: string
    cancelRequest: string
    addFriend: string
  }
  userMenu: {
    viewProfile: string
    settings: string
    darkMode: string
    lightMode: string
    signOut: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    sidebar: {
      home: 'Home',
      explore: 'Explore',
      messages: 'Messages',
      friendRequests: 'Friend Requests',
      notifications: 'Notifications',
      settings: 'Settings',
      logo: 'Comet',
      create: 'Create',
      createPost: 'Create Post',
    },
    header: {
      searchPlaceholder: 'Search Comet...',
      notifications: 'Notifications',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your celestial presence and customize your experience.',
      categories: {
        appearance: 'Appearance',
        privacy: 'Blocking',
      },
      appearance: {
        title: 'Appearance & Language',
        subtitle: 'Customize your visual experience and language preferences',
        theme: {
          label: 'Theme',
          light: 'Light Mode',
          dark: 'Dark Mode',
          system: 'System Default',
        },
        language: {
          label: 'Language',
          english: 'English',
          arabic: 'العربية',
        },
      },
      privacy: {
        title: 'Blocking',
        subtitle: 'Manage who can see your content and who you\'ve blocked',
        blockedUsers: {
          title: 'Blocked Users',
          empty: 'You haven\'t blocked anyone.',
          unblock: 'Unblock',
        },
      },
    },
    common: {
      cancel: 'Cancel',
      save: 'Save',
      loading: 'Loading...',
      retry: 'Retry',
      delete: 'Delete',
      confirm: 'Confirm',
      close: 'Close',
      share: 'Share',
      edit: 'Edit',
      remove: 'Remove',
      add: 'Add',
      search: 'Search',
      seeMore: 'See more',
      noResults: 'No results found.',
    },
    auth: {
      login: {
        title: 'Welcome Back',
        subtitle: 'Return to your celestial sanctuary',
        emailLabel: 'Email Address',
        passwordLabel: 'Password',
        submit: 'Sign In',
        submitting: 'Signing In...',
        orContinueWith: 'Or continue with',
        noAccount: 'Don\'t have an account?',
        signUpLink: 'Sign Up',
      },
      register: {
        title: 'Create Account',
        subtitle: 'Begin your celestial journey',
        firstNameLabel: 'First Name',
        lastNameLabel: 'Last Name',
        emailLabel: 'Email',
        cityLabel: 'City',
        countryLabel: 'Country',
        genderLabel: 'Gender',
        genderMale: 'Male',
        genderFemale: 'Female',
        passwordLabel: 'Password',
        submit: 'Create Account',
        submitting: 'Creating Account...',
        haveAccount: 'Already have an account?',
        signInLink: 'Sign In',
      },
    },
    home: {
      addStory: 'Add Story',
      createPlaceholder: 'Share your celestial thoughts...',
      launch: 'Launch',
      launching: 'Launching...',
      loadingFeed: 'Traversing the cosmos...',
      errorLoadingFeed: 'Failed to load your feed.',
      emptyFeed: 'No posts yet. Be the first to share something!',
      savePost: 'Save Post',
      hidePost: 'Hide Post',
      sharePost: 'Share',
      editPost: 'Edit Post',
      postSaved: 'Post saved successfully!',
      postAlreadySaved: 'Post already saved',
      postHidden: 'Post hidden from your feed',
      linkCopied: 'Link copied to clipboard!',
      writeComment: 'Write a cosmic comment...',
      noComments: 'No comments yet.',
    },
    profile: {
      postsCount: 'Posts',
      friendsCount: 'Friends',
      editProfile: 'Edit Profile',
      share: 'Share',
      tabPortfolio: 'Portfolio',
      tabSaved: 'Saved',
      emptySaved: 'No saved posts yet. Bookmark posts to find them here.',
      emptyPosts: 'No posts yet. Start sharing!',
      avatarUpdated: 'Profile picture updated!',
      avatarUpdateFailed: 'Failed to save profile picture. Please try again.',
      avatarUploadFailed: 'Failed to upload image. Please try again.',
      removedFromSaved: 'Removed from saved',
      unsaveFailed: 'Failed to unsave post',
    },
    messages: {
      title: 'Messages',
      group: 'Group',
      loadError: 'Could not load conversations.',
      noConversations: 'No conversations yet.',
      startConversation: 'Start a conversation',
      photoPreview: '📷 Photo',
      noMessagesPreview: 'No messages yet',
      members: 'members',
      selectConversation: 'Select a conversation to start messaging.',
      directMessage: 'Direct message',
      noMessagesYet: 'No messages yet. Say hello!',
      typeMessage: 'Type your celestial message...',
      uploadImageFailed: 'Failed to upload image. Please try again.',
      sendFailed: 'Failed to send message.',
      groupInfo: 'Group Info',
      unnamedGroup: 'Unnamed Group',
      membersHeader: 'Members',
      allFriendsInGroup: 'All your friends are already in this group.',
      memberAdded: 'Member added',
      addMemberFailed: 'Failed to add member. Please try again.',
      you: '(You)',
      admin: 'Admin',
      confirmLeave: 'Confirm Leave',
      leaveGroup: 'Leave Group',
      leftGroup: 'You left the group',
      leaveFailed: 'Failed to leave group. Please try again.',
      memberRemoved: 'Member removed',
      removeFailed: 'Failed to remove member. Please try again.',
      newMessage: 'New Message',
      groupNamePlaceholder: 'Group name (optional)',
      noFriendsToMessage: 'No friends yet to message.',
      createGroup: 'Create Group',
      startConversationBtn: 'Start Conversation',
      groupCreated: 'Group created!',
      conversationStarted: 'Conversation started!',
      startConversationFailed: 'Failed to start conversation. Please try again.',
    },
    notifications: {
      title: 'Notifications',
      subtitle: 'Your cosmic interactions and updates.',
      markAllRead: 'Mark all read',
      tabDirect: 'Direct',
      tabDirectDesc: 'Friend requests, mentions & messages',
      tabActivity: 'Activity',
      tabActivityDesc: 'Likes & comments on your posts',
      loadError: 'Could not load notifications.',
      allCaughtUp: "You're all caught up!",
      today: 'Today',
      earlier: 'Earlier',
      someone: 'Someone',
      reactedToComment: 'reacted to your comment.',
      reactedToPost: 'reacted to your post.',
      commentedOnPost: 'commented on your post.',
      sentFriendRequest: 'sent you a friend request.',
      acceptedFriendRequest: 'accepted your friend request.',
      mentionedYou: 'mentioned you in a comment.',
      sentMessageWithPreview: 'sent you a message: "{preview}"',
      sentMessage: 'sent you a message.',
      interacted: 'interacted with your content.',
      minutesAgo: '{n}m ago',
      hoursAgo: '{n}h ago',
      daysAgo: '{n}d ago',
    },
    search: {
      title: 'Search User by Email',
      subtitle: 'Enter an email address to find and view user profiles',
      placeholder: 'user@example.com',
      search: 'Search',
      clear: 'Clear',
      recentSearches: 'Recent Searches',
      clearAll: 'Clear all',
      searchFailed: 'Search Failed',
      searchFailedGeneric: 'Unable to search for user. Please try again.',
      noUserFound: 'No User Found',
      noUserFoundDesc: 'We couldn\'t find a user matching "{query}". Please check the email and try again.',
      viewProfile: 'View Profile',
      role: 'Role',
      memberSince: 'Member Since',
      searchForUsers: 'Search for Users',
      searchForUsersDesc: 'Enter an email address above to search for a user and view their profile information.',
      userName: 'User Name',
      verified: 'Verified',
    },
    friendRequests: {
      title: 'Friend Requests',
      unknownUser: 'Unknown User',
      accept: 'Accept',
      decline: 'Decline',
      noPending: 'No pending friend requests',
    },
    createPost: {
      title: 'New Cosmic Thread',
      placeholder: "What's happening in your corner of the universe?",
      visibilityUniversal: 'Universal',
      visibilityUniversalDesc: 'Visible to every curator in the galaxy.',
      visibilityInnerCircle: 'Inner Circle',
      visibilityInnerCircleDesc: 'Only shared with your trusted satellite groups.',
      visibilityPrivate: 'Private Drift',
      visibilityPrivateDesc: 'Stored in your personal archive only.',
      whoCanSee: 'Who can see this post?',
      schedule: 'Schedule',
      scheduled: 'Scheduled',
      schedulePostLabel: 'Schedule Post',
      schedulePlaceholder: 'Pick a future date and time',
      discard: 'Discard',
      postNow: 'Post Now',
      launching: 'Launching...',
      needContentWarning: 'Please add some content or media before posting',
      postScheduled: 'Post scheduled successfully!',
      invalidScheduledData: 'Invalid scheduled date or content',
      scheduleFailed: 'Failed to schedule post. Please try again.',
      postCreated: 'Post created successfully!',
      sessionExpired: 'Session expired. Please login again.',
      postTooLarge: 'Post content or media is too large',
      serverError: 'Server error. Please try again later.',
      filesUploaded: 'file(s) uploaded successfully',
      uploadFailedGeneric: 'Upload failed. Please try again.',
      editTitle: 'Edit Post',
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      postUpdated: 'Post updated successfully!',
      updateFailed: 'Failed to update post. Please try again.',
      loadingPost: 'Loading post...',
      currentMedia: 'Current Media',
      addNewMedia: 'Add New Media',
      feelingLabel: 'Feeling/Activity (Optional)',
      feelingPlaceholder: 'e.g., happy, excited, traveling',
      locationLabel: 'Location (Optional)',
      locationPlaceholder: 'e.g., Damascus, Syria',
      needContentWarningUpdate: 'Please add some content or media before updating',
      permissionDenied: 'You do not have permission to edit this post',
      postNotFound: 'Post not found',
      invalidPostSettings: 'Invalid post content or settings',
    },
    createStory: {
      title: 'Create Story',
      invalidFileType: 'Invalid file type. Please upload an image or video.',
      addContentWarning: 'Please add content or media to your story',
      publishing: 'Publishing your story...',
      published: 'Story published! It will be visible for 24 hours.',
      sessionExpired: 'Session expired. Please login again.',
      noPermission: 'You do not have permission to create stories.',
      endpointNotFound: 'Story endpoint not found.',
      publishFailed: 'Failed to publish story. Please try again.',
      invalidContent: 'Invalid story content. Please check your input.',
      visibilityPublic: 'Public',
      visibilityFriends: 'Friends',
      visibilityOnlyMe: 'Only Me',
      visibilityLabel: 'Visibility',
      expiresIn24h: 'Expires in 24h',
      statusPlaceholder: 'Type your status...',
      uploadMedia: 'Upload Media',
      shareNow: 'Share Now',
      sharing: 'Sharing...',
    },
    storiesScreen: {
      failedToLoad: 'Failed to load stories',
      errorOccurred: 'An error occurred',
      goBack: 'Go Back',
      noStoriesYet: 'No stories yet',
      anonymous: 'Anonymous',
      recent: 'Recent',
      noContent: 'No content',
      deleteConfirm: 'Delete this story? This action cannot be undone.',
      deleted: 'Story deleted successfully',
      noPermissionDelete: 'You do not have permission to delete this story.',
      notFoundOrDeleted: 'Story not found or already deleted.',
      deleteFailed: 'Failed to delete story. Please try again.',
    },
    createGroupModal: {
      title: 'Create Group Chat',
      imageTooLarge: 'Image must be less than 5MB',
      selectImageFile: 'Please select an image file',
      changePhoto: 'Change Group Photo',
      addPhoto: 'Add Group Photo',
      groupNameLabel: 'Group Name',
      groupNamePlaceholder: 'Enter group name',
      charactersCount: 'characters',
      descriptionLabel: 'Description (Optional)',
      descriptionPlaceholder: "What's this group about?",
      addMembers: 'Add Members',
      noFriendsMatching: 'No friends found matching your search',
      noFriendsToAdd: 'No friends to add',
      searchFriends: 'Search friends...',
      nameRequired: 'Group name is required',
      nameTooShort: 'Group name must be at least 3 characters',
      nameTooLong: 'Group name must be less than 50 characters',
      selectAtLeastOne: 'Select at least 1 member',
      avatarUploadFailed: 'Failed to upload group avatar',
      groupCreated: 'Group created successfully!',
      createFailed: 'Failed to create group',
      unexpectedError: 'An unexpected error occurred',
      creating: 'Creating...',
      createGroup: 'Create Group',
    },
    editProfile: {
      title: 'Edit Profile',
      subtitle: 'Update your profile information',
      save: 'Save',
      coverPhoto: 'Cover Photo',
      uploading: 'Uploading...',
      clickToUploadCover: 'Click to upload cover photo',
      coverHint: 'Recommended: 1500x500px • Max size: 10MB • JPG, PNG, GIF',
      profilePicture: 'Profile Picture',
      uploadPhoto: 'Upload Photo',
      remove: 'Remove',
      avatarHint: 'Square image • Max 10MB',
      nameLabel: 'Name',
      namePlaceholder: 'Your full name',
      usernameLabel: 'Username',
      usernamePlaceholder: '@username',
      bioLabel: 'Bio',
      bioPlaceholder: 'Tell us about yourself...',
      charactersOf160: '/ 160 characters',
      cityLabel: 'City',
      cityPlaceholder: 'Damascus',
      countryLabel: 'Country',
      countryPlaceholder: 'Syria',
      genderLabel: 'Gender',
      genderMale: 'Male',
      genderFemale: 'Female',
      genderOther: 'Other',
      genderPreferNotToSay: 'Prefer not to say',
      cancel: 'Cancel',
      saveChanges: 'Save Changes',
      invalidImageFile: 'Please select a valid image file',
      imageTooLarge10: 'Image size must be less than 10MB',
      readImageFailed: 'Failed to read image file',
      avatarUploaded: 'Avatar uploaded successfully',
      avatarUploadFailed: 'Failed to upload avatar',
      coverUploaded: 'Cover photo uploaded successfully',
      coverUploadFailed: 'Failed to upload cover photo',
      nameRequired: 'Name is required',
      usernameRequired: 'Username is required',
      profileUpdated: 'Profile updated successfully!',
      updateFailed: 'Failed to update profile',
    },
    postDetail: {
      backToFeed: 'Back to Feed',
      editPost: 'Edit Post',
      deletePost: 'Delete Post',
      noActionsAvailable: 'No actions available',
      share: 'Share',
      saved: 'Saved',
      save: 'Save',
      addThoughtsPlaceholder: 'Add your thoughts to the cosmos...',
      theConversation: 'The Conversation',
      noComments: 'No comments yet. Be the first to contribute!',
      anonymous: 'Anonymous',
      like: 'Like',
      reply: 'Reply',
      replyToPlaceholder: 'Reply to {name}...',
      postNotFound: 'Post not found.',
      goBack: 'Go Back',
      removedFromSaved: 'Removed from saved',
      unsaveFailed: 'Failed to unsave post',
      postSaved: 'Post saved!',
      postAlreadySaved: 'Post already saved',
      saveFailed: 'Failed to save post',
      linkCopiedAlert: 'Cosmic link copied to clipboard! 🌌',
      postDeleted: 'Post deleted.',
      deleteFailed: 'Failed to delete post. Please try again.',
    },
    friendsList: {
      title: 'Friends',
      noFriendsYet: 'No friends yet.',
      unfriend: 'Unfriend',
    },
    userActions: {
      unblock: 'Unblock',
      confirmBlock: 'Confirm Block',
      cancel: 'Cancel',
      confirmUnfriend: 'Confirm Unfriend',
      friends: 'Friends',
      unfriendAction: 'Unfriend',
      block: 'Block',
      accept: 'Accept',
      decline: 'Decline',
      requestSent: 'Request Sent',
      cancelRequest: 'Cancel Request',
      addFriend: 'Add Friend',
    },
    userMenu: {
      viewProfile: 'View Profile',
      settings: 'Settings',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      signOut: 'Sign Out',
    },
  },
  ar: {
    sidebar: {
      home: 'الرئيسية',
      explore: 'استكشف',
      messages: 'الرسائل',
      friendRequests: 'طلبات الصداقة',
      notifications: 'الإشعارات',
      settings: 'الإعدادات',
      logo: 'كوميت',
      create: 'إنشاء',
      createPost: 'إنشاء منشور',
    },
    header: {
      searchPlaceholder: 'البحث في كوميت...',
      notifications: 'الإشعارات',
    },
    settings: {
      title: 'الإعدادات',
      subtitle: 'إدارة وجودك الرقمي وتخصيص تجربتك.',
      categories: {
        appearance: 'المظهر',
        privacy: 'الحظر',
      },
      appearance: {
        title: 'المظهر واللغة',
        subtitle: 'تخصيص تجربتك البصرية وتفضيلات اللغة',
        theme: {
          label: 'المظهر',
          light: 'الوضع الفاتح',
          dark: 'الوضع الداكن',
          system: 'افتراضي النظام',
        },
        language: {
          label: 'اللغة',
          english: 'English',
          arabic: 'العربية',
        },
      },
      privacy: {
        title: 'الحظر',
        subtitle: 'إدارة من يمكنه رؤية محتواك ومن قمت بحظره',
        blockedUsers: {
          title: 'المستخدمون المحظورون',
          empty: 'لم تقم بحظر أي أحد.',
          unblock: 'إلغاء الحظر',
        },
      },
    },
    common: {
      cancel: 'إلغاء',
      save: 'حفظ',
      loading: 'جارٍ التحميل...',
      retry: 'إعادة المحاولة',
      delete: 'حذف',
      confirm: 'تأكيد',
      close: 'إغلاق',
      share: 'مشاركة',
      edit: 'تعديل',
      remove: 'إزالة',
      add: 'إضافة',
      search: 'بحث',
      seeMore: 'عرض المزيد',
      noResults: 'لا توجد نتائج.',
    },
    auth: {
      login: {
        title: 'مرحبًا بعودتك',
        subtitle: 'عد إلى ملاذك السماوي',
        emailLabel: 'البريد الإلكتروني',
        passwordLabel: 'كلمة المرور',
        submit: 'تسجيل الدخول',
        submitting: 'جارٍ تسجيل الدخول...',
        orContinueWith: 'أو تابع باستخدام',
        noAccount: 'ليس لديك حساب؟',
        signUpLink: 'إنشاء حساب',
      },
      register: {
        title: 'إنشاء حساب',
        subtitle: 'ابدأ رحلتك السماوية',
        firstNameLabel: 'الاسم الأول',
        lastNameLabel: 'اسم العائلة',
        emailLabel: 'البريد الإلكتروني',
        cityLabel: 'المدينة',
        countryLabel: 'الدولة',
        genderLabel: 'الجنس',
        genderMale: 'ذكر',
        genderFemale: 'أنثى',
        passwordLabel: 'كلمة المرور',
        submit: 'إنشاء حساب',
        submitting: 'جارٍ إنشاء الحساب...',
        haveAccount: 'لديك حساب بالفعل؟',
        signInLink: 'تسجيل الدخول',
      },
    },
    home: {
      addStory: 'إضافة قصة',
      createPlaceholder: 'شارك أفكارك السماوية...',
      launch: 'نشر',
      launching: 'جارٍ النشر...',
      loadingFeed: 'جارٍ عبور الفضاء...',
      errorLoadingFeed: 'فشل تحميل الخلاصة.',
      emptyFeed: 'لا توجد منشورات بعد. كن أول من يشارك شيئًا!',
      savePost: 'حفظ المنشور',
      hidePost: 'إخفاء المنشور',
      sharePost: 'مشاركة',
      editPost: 'تعديل المنشور',
      postSaved: 'تم حفظ المنشور بنجاح!',
      postAlreadySaved: 'المنشور محفوظ بالفعل',
      postHidden: 'تم إخفاء المنشور من الخلاصة',
      linkCopied: 'تم نسخ الرابط!',
      writeComment: 'اكتب تعليقًا...',
      noComments: 'لا توجد تعليقات بعد.',
    },
    profile: {
      postsCount: 'منشورات',
      friendsCount: 'أصدقاء',
      editProfile: 'تعديل الملف الشخصي',
      share: 'مشاركة',
      tabPortfolio: 'المعرض',
      tabSaved: 'المحفوظات',
      emptySaved: 'لا توجد منشورات محفوظة بعد. احفظ منشورًا ليظهر هنا.',
      emptyPosts: 'لا توجد منشورات بعد. ابدأ المشاركة!',
      avatarUpdated: 'تم تحديث صورة الملف الشخصي!',
      avatarUpdateFailed: 'فشل حفظ صورة الملف الشخصي. حاول مرة أخرى.',
      avatarUploadFailed: 'فشل رفع الصورة. حاول مرة أخرى.',
      removedFromSaved: 'تمت الإزالة من المحفوظات',
      unsaveFailed: 'فشل إلغاء حفظ المنشور',
    },
    messages: {
      title: 'الرسائل',
      group: 'مجموعة',
      loadError: 'تعذّر تحميل المحادثات.',
      noConversations: 'لا توجد محادثات بعد.',
      startConversation: 'ابدأ محادثة',
      photoPreview: '📷 صورة',
      noMessagesPreview: 'لا توجد رسائل بعد',
      members: 'أعضاء',
      selectConversation: 'اختر محادثة لبدء المراسلة.',
      directMessage: 'رسالة مباشرة',
      noMessagesYet: 'لا توجد رسائل بعد. قل مرحبًا!',
      typeMessage: 'اكتب رسالتك...',
      uploadImageFailed: 'فشل رفع الصورة. حاول مرة أخرى.',
      sendFailed: 'فشل إرسال الرسالة.',
      groupInfo: 'معلومات المجموعة',
      unnamedGroup: 'مجموعة بدون اسم',
      membersHeader: 'الأعضاء',
      allFriendsInGroup: 'كل أصدقائك موجودون بالفعل في هذه المجموعة.',
      memberAdded: 'تمت إضافة العضو',
      addMemberFailed: 'فشل إضافة العضو. حاول مرة أخرى.',
      you: '(أنت)',
      admin: 'مشرف',
      confirmLeave: 'تأكيد المغادرة',
      leaveGroup: 'مغادرة المجموعة',
      leftGroup: 'لقد غادرت المجموعة',
      leaveFailed: 'فشل مغادرة المجموعة. حاول مرة أخرى.',
      memberRemoved: 'تمت إزالة العضو',
      removeFailed: 'فشل إزالة العضو. حاول مرة أخرى.',
      newMessage: 'رسالة جديدة',
      groupNamePlaceholder: 'اسم المجموعة (اختياري)',
      noFriendsToMessage: 'لا يوجد أصدقاء لمراسلتهم بعد.',
      createGroup: 'إنشاء مجموعة',
      startConversationBtn: 'بدء المحادثة',
      groupCreated: 'تم إنشاء المجموعة!',
      conversationStarted: 'تم بدء المحادثة!',
      startConversationFailed: 'فشل بدء المحادثة. حاول مرة أخرى.',
    },
    notifications: {
      title: 'الإشعارات',
      subtitle: 'تفاعلاتك وتحديثاتك.',
      markAllRead: 'تعليم الكل كمقروء',
      tabDirect: 'مباشر',
      tabDirectDesc: 'طلبات الصداقة والإشارات والرسائل',
      tabActivity: 'التفاعلات',
      tabActivityDesc: 'الإعجابات والتعليقات على منشوراتك',
      loadError: 'تعذّر تحميل الإشعارات.',
      allCaughtUp: 'أنت مطّلع على كل شيء!',
      today: 'اليوم',
      earlier: 'سابقًا',
      someone: 'شخص ما',
      reactedToComment: 'تفاعل مع تعليقك.',
      reactedToPost: 'تفاعل مع منشورك.',
      commentedOnPost: 'علّق على منشورك.',
      sentFriendRequest: 'أرسل لك طلب صداقة.',
      acceptedFriendRequest: 'قبل طلب صداقتك.',
      mentionedYou: 'أشار إليك في تعليق.',
      sentMessageWithPreview: 'أرسل لك رسالة: "{preview}"',
      sentMessage: 'أرسل لك رسالة.',
      interacted: 'تفاعل مع محتواك.',
      minutesAgo: 'منذ {n} د',
      hoursAgo: 'منذ {n} س',
      daysAgo: 'منذ {n} يوم',
    },
    search: {
      title: 'البحث عن مستخدم بالبريد الإلكتروني',
      subtitle: 'أدخل عنوان بريد إلكتروني للعثور على ملفات المستخدمين وعرضها',
      placeholder: 'user@example.com',
      search: 'بحث',
      clear: 'مسح',
      recentSearches: 'عمليات البحث الأخيرة',
      clearAll: 'مسح الكل',
      searchFailed: 'فشل البحث',
      searchFailedGeneric: 'تعذّر البحث عن المستخدم. حاول مرة أخرى.',
      noUserFound: 'لم يتم العثور على مستخدم',
      noUserFoundDesc: 'لم نتمكن من العثور على مستخدم مطابق لـ "{query}". يرجى التحقق من البريد الإلكتروني والمحاولة مرة أخرى.',
      viewProfile: 'عرض الملف الشخصي',
      role: 'الدور',
      memberSince: 'عضو منذ',
      searchForUsers: 'البحث عن مستخدمين',
      searchForUsersDesc: 'أدخل عنوان بريد إلكتروني أعلاه للبحث عن مستخدم وعرض معلومات ملفه الشخصي.',
      userName: 'اسم المستخدم',
      verified: 'موثّق',
    },
    friendRequests: {
      title: 'طلبات الصداقة',
      unknownUser: 'مستخدم غير معروف',
      accept: 'قبول',
      decline: 'رفض',
      noPending: 'لا توجد طلبات صداقة معلّقة',
    },
    createPost: {
      title: 'خيط كوني جديد',
      placeholder: 'ما الذي يحدث في ركنك من الكون؟',
      visibilityUniversal: 'عام',
      visibilityUniversalDesc: 'مرئي لكل مستخدم في المجرة.',
      visibilityInnerCircle: 'الدائرة الداخلية',
      visibilityInnerCircleDesc: 'يُشارك فقط مع مجموعاتك الموثوقة.',
      visibilityPrivate: 'خاص',
      visibilityPrivateDesc: 'يُحفظ في أرشيفك الشخصي فقط.',
      whoCanSee: 'من يمكنه رؤية هذا المنشور؟',
      schedule: 'جدولة',
      scheduled: 'مجدول',
      schedulePostLabel: 'جدولة المنشور',
      schedulePlaceholder: 'اختر تاريخًا ووقتًا مستقبليًا',
      discard: 'تجاهل',
      postNow: 'نشر الآن',
      launching: 'جارٍ النشر...',
      needContentWarning: 'يرجى إضافة محتوى أو وسائط قبل النشر',
      postScheduled: 'تم جدولة المنشور بنجاح!',
      invalidScheduledData: 'تاريخ أو محتوى الجدولة غير صالح',
      scheduleFailed: 'فشلت جدولة المنشور. حاول مرة أخرى.',
      postCreated: 'تم نشر المنشور بنجاح!',
      sessionExpired: 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.',
      postTooLarge: 'محتوى المنشور أو الوسائط كبيرة جدًا',
      serverError: 'خطأ في الخادم. حاول مرة أخرى لاحقًا.',
      filesUploaded: 'ملف تم رفعه بنجاح',
      uploadFailedGeneric: 'فشل الرفع. حاول مرة أخرى.',
      editTitle: 'تعديل المنشور',
      saveChanges: 'حفظ التغييرات',
      saving: 'جارٍ الحفظ...',
      postUpdated: 'تم تحديث المنشور بنجاح!',
      updateFailed: 'فشل تحديث المنشور. حاول مرة أخرى.',
      loadingPost: 'جارٍ تحميل المنشور...',
      currentMedia: 'الوسائط الحالية',
      addNewMedia: 'إضافة وسائط جديدة',
      feelingLabel: 'الشعور/النشاط (اختياري)',
      feelingPlaceholder: 'مثال: سعيد، متحمس، يسافر',
      locationLabel: 'الموقع (اختياري)',
      locationPlaceholder: 'مثال: دمشق، سوريا',
      needContentWarningUpdate: 'يرجى إضافة محتوى أو وسائط قبل التحديث',
      permissionDenied: 'ليس لديك صلاحية لتعديل هذا المنشور',
      postNotFound: 'المنشور غير موجود',
      invalidPostSettings: 'محتوى أو إعدادات المنشور غير صالحة',
    },
    createStory: {
      title: 'إنشاء قصة',
      invalidFileType: 'نوع ملف غير صالح. يرجى رفع صورة أو فيديو.',
      addContentWarning: 'يرجى إضافة محتوى أو وسائط لقصتك',
      publishing: 'جارٍ نشر قصتك...',
      published: 'تم نشر القصة! ستكون مرئية لمدة 24 ساعة.',
      sessionExpired: 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.',
      noPermission: 'ليس لديك صلاحية لإنشاء قصص.',
      endpointNotFound: 'نقطة نهاية القصة غير موجودة.',
      publishFailed: 'فشل نشر القصة. حاول مرة أخرى.',
      invalidContent: 'محتوى القصة غير صالح. يرجى التحقق من إدخالك.',
      visibilityPublic: 'عام',
      visibilityFriends: 'الأصدقاء',
      visibilityOnlyMe: 'أنا فقط',
      visibilityLabel: 'الخصوصية',
      expiresIn24h: 'تنتهي خلال 24 ساعة',
      statusPlaceholder: 'اكتب حالتك...',
      uploadMedia: 'رفع وسائط',
      shareNow: 'مشاركة الآن',
      sharing: 'جارٍ المشاركة...',
    },
    storiesScreen: {
      failedToLoad: 'فشل تحميل القصص',
      errorOccurred: 'حدث خطأ',
      goBack: 'رجوع',
      noStoriesYet: 'لا توجد قصص بعد',
      anonymous: 'مجهول',
      recent: 'مؤخرًا',
      noContent: 'لا يوجد محتوى',
      deleteConfirm: 'حذف هذه القصة؟ لا يمكن التراجع عن هذا الإجراء.',
      deleted: 'تم حذف القصة بنجاح',
      noPermissionDelete: 'ليس لديك صلاحية لحذف هذه القصة.',
      notFoundOrDeleted: 'القصة غير موجودة أو محذوفة بالفعل.',
      deleteFailed: 'فشل حذف القصة. حاول مرة أخرى.',
    },
    createGroupModal: {
      title: 'إنشاء مجموعة محادثة',
      imageTooLarge: 'يجب أن تكون الصورة أقل من 5 ميغابايت',
      selectImageFile: 'يرجى اختيار ملف صورة',
      changePhoto: 'تغيير صورة المجموعة',
      addPhoto: 'إضافة صورة للمجموعة',
      groupNameLabel: 'اسم المجموعة',
      groupNamePlaceholder: 'أدخل اسم المجموعة',
      charactersCount: 'حرف',
      descriptionLabel: 'الوصف (اختياري)',
      descriptionPlaceholder: 'ما موضوع هذه المجموعة؟',
      addMembers: 'إضافة أعضاء',
      noFriendsMatching: 'لا يوجد أصدقاء مطابقون لبحثك',
      noFriendsToAdd: 'لا يوجد أصدقاء لإضافتهم',
      searchFriends: 'ابحث عن أصدقاء...',
      nameRequired: 'اسم المجموعة مطلوب',
      nameTooShort: 'يجب أن يتكون اسم المجموعة من 3 أحرف على الأقل',
      nameTooLong: 'يجب أن يكون اسم المجموعة أقل من 50 حرفًا',
      selectAtLeastOne: 'اختر عضوًا واحدًا على الأقل',
      avatarUploadFailed: 'فشل رفع صورة المجموعة',
      groupCreated: 'تم إنشاء المجموعة بنجاح!',
      createFailed: 'فشل إنشاء المجموعة',
      unexpectedError: 'حدث خطأ غير متوقع',
      creating: 'جارٍ الإنشاء...',
      createGroup: 'إنشاء مجموعة',
    },
    editProfile: {
      title: 'تعديل الملف الشخصي',
      subtitle: 'تحديث معلومات ملفك الشخصي',
      save: 'حفظ',
      coverPhoto: 'صورة الغلاف',
      uploading: 'جارٍ الرفع...',
      clickToUploadCover: 'انقر لرفع صورة الغلاف',
      coverHint: 'الحجم الموصى به: 1500×500 بكسل • الحد الأقصى: 10 ميغابايت • JPG, PNG, GIF',
      profilePicture: 'الصورة الشخصية',
      uploadPhoto: 'رفع صورة',
      remove: 'إزالة',
      avatarHint: 'صورة مربعة • بحد أقصى 10 ميغابايت',
      nameLabel: 'الاسم',
      namePlaceholder: 'اسمك الكامل',
      usernameLabel: 'اسم المستخدم',
      usernamePlaceholder: '@اسم_المستخدم',
      bioLabel: 'نبذة',
      bioPlaceholder: 'أخبرنا عن نفسك...',
      charactersOf160: '/ 160 حرف',
      cityLabel: 'المدينة',
      cityPlaceholder: 'دمشق',
      countryLabel: 'الدولة',
      countryPlaceholder: 'سوريا',
      genderLabel: 'الجنس',
      genderMale: 'ذكر',
      genderFemale: 'أنثى',
      genderOther: 'آخر',
      genderPreferNotToSay: 'أفضل عدم القول',
      cancel: 'إلغاء',
      saveChanges: 'حفظ التغييرات',
      invalidImageFile: 'يرجى اختيار ملف صورة صالح',
      imageTooLarge10: 'يجب أن يكون حجم الصورة أقل من 10 ميغابايت',
      readImageFailed: 'فشل قراءة ملف الصورة',
      avatarUploaded: 'تم رفع الصورة الشخصية بنجاح',
      avatarUploadFailed: 'فشل رفع الصورة الشخصية',
      coverUploaded: 'تم رفع صورة الغلاف بنجاح',
      coverUploadFailed: 'فشل رفع صورة الغلاف',
      nameRequired: 'الاسم مطلوب',
      usernameRequired: 'اسم المستخدم مطلوب',
      profileUpdated: 'تم تحديث الملف الشخصي بنجاح!',
      updateFailed: 'فشل تحديث الملف الشخصي',
    },
    postDetail: {
      backToFeed: 'العودة إلى الخلاصة',
      editPost: 'تعديل المنشور',
      deletePost: 'حذف المنشور',
      noActionsAvailable: 'لا توجد إجراءات متاحة',
      share: 'مشاركة',
      saved: 'محفوظ',
      save: 'حفظ',
      addThoughtsPlaceholder: 'أضف أفكارك...',
      theConversation: 'المحادثة',
      noComments: 'لا توجد تعليقات بعد. كن أول من يشارك!',
      anonymous: 'مجهول',
      like: 'إعجاب',
      reply: 'رد',
      replyToPlaceholder: 'الرد على {name}...',
      postNotFound: 'المنشور غير موجود.',
      goBack: 'رجوع',
      removedFromSaved: 'تمت الإزالة من المحفوظات',
      unsaveFailed: 'فشل إلغاء حفظ المنشور',
      postSaved: 'تم حفظ المنشور!',
      postAlreadySaved: 'المنشور محفوظ بالفعل',
      saveFailed: 'فشل حفظ المنشور',
      linkCopiedAlert: 'تم نسخ الرابط! 🌌',
      postDeleted: 'تم حذف المنشور.',
      deleteFailed: 'فشل حذف المنشور. حاول مرة أخرى.',
    },
    friendsList: {
      title: 'الأصدقاء',
      noFriendsYet: 'لا يوجد أصدقاء بعد.',
      unfriend: 'إلغاء الصداقة',
    },
    userActions: {
      unblock: 'إلغاء الحظر',
      confirmBlock: 'تأكيد الحظر',
      cancel: 'إلغاء',
      confirmUnfriend: 'تأكيد إلغاء الصداقة',
      friends: 'أصدقاء',
      unfriendAction: 'إلغاء الصداقة',
      block: 'حظر',
      accept: 'قبول',
      decline: 'رفض',
      requestSent: 'تم إرسال الطلب',
      cancelRequest: 'إلغاء الطلب',
      addFriend: 'إضافة صديق',
    },
    userMenu: {
      viewProfile: 'عرض الملف الشخصي',
      settings: 'الإعدادات',
      darkMode: 'الوضع الداكن',
      lightMode: 'الوضع الفاتح',
      signOut: 'تسجيل الخروج',
    },
  },
}

/**
 * Get translations for a specific language
 */
export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en
}
