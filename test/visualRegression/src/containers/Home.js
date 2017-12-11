import React from 'react'
import { getSiteProps, Link } from 'react-static'

export default getSiteProps(() => (
  <div>
      <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
      </ul>
  </div>
))
