import React from 'react'

const Nav: React.FC = () => {
  return (
    <nav className="w-full flex justify-center py-4 bg-gray-800">
      <ul className="flex space-x-4 text-white">
        <li>avatar</li>
        <li>Project Name</li>
        <li>Client</li>
      </ul>
    </nav>
  )
}

export default Nav
