import { DeleteUser } from '@/components/user-settings/delete-user'
import { GoBackButton } from '@/components/user-settings/go-back-button'
import { PasswordSettingsForm } from '@/components/user-settings/password-settings-form'
import { ProfileSettingsForm } from '@/components/user-settings/profile-settings-form'
import { getCurrentUser } from '@/lib/actions/auth'

export default async function UserSettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return (
    <div className="container max-w-2xl pb-6 space-y-6">
      <GoBackButton />

      <ProfileSettingsForm user={user} />
      <PasswordSettingsForm />

      <DeleteUser userId={user.id} />
    </div>
  )
}
