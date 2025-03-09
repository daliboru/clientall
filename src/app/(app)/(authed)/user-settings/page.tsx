import { DeleteUser } from '../../_components/user-settings/delete-user'
import { GoBackButton } from '../../_components/user-settings/go-back-button'
import { PasswordSettingsForm } from '../../_components/user-settings/password-settings-form'
import { ProfileSettingsForm } from '../../_components/user-settings/profile-settings-form'

export default async function UserSettingsPage() {
  return (
    <div className="container max-w-2xl pb-6 space-y-6">
      <GoBackButton />

      <ProfileSettingsForm />
      <PasswordSettingsForm />

      <DeleteUser />
    </div>
  )
}
