export async function logoutAction() {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/logout`, {
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
