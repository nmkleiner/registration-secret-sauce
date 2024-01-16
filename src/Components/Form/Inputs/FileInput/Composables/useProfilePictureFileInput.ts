import { useUserStore } from '../../../../../Stores/User/user.store';
import { FileInput } from '../../../../../Entities/FormElements/file-input';

const ProfilePicture = 'Profile Picture';
const saveProfilePictureFromDocumentUploads = ref(false);
export function useProfilePictureFileInput() {
  function setSaveProfilePictureFromDocumentUploads(value: boolean) {
    saveProfilePictureFromDocumentUploads.value = value;
  }

  async function checkToUploadProfilePicture(newValue: boolean, input: FileInput) {
    if (newValue && input.fileTopic === ProfilePicture) {
      useUserStore().setProfileLocalFile(input.file);
      await useUserStore().updateProfilePicture();
      setSaveProfilePictureFromDocumentUploads(false);
    }
  }

  return {
    ProfilePicture,
    checkToUploadProfilePicture,
    saveProfilePictureFromDocumentUploads,
    setSaveProfilePictureFromDocumentUploads,
  };
}
