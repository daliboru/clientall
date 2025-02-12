export async function logoutAction() {
  try {
    await fetch('/api/users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    window.location.reload()
  } catch (error) {
    console.error(error)
  }
}
