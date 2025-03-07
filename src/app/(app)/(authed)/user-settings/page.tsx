import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

import { DeleteUser } from '../../_components/user-settings/delete-user'
import { GoBackButton } from '../../_components/user-settings/go-back-button'
import { PasswordSettingsForm } from '../../_components/user-settings/password-settings-form'
import { ProfileSettingsForm } from '../../_components/user-settings/profile-settings-form'

export default async function UserSettingsPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { permissions, user } = await payload.auth({ headers })

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
