import React from 'react'
import { getClasses } from '../../utils/getClasses'
const Card = ({classes, ...rest}) => {

  return (
    <div className={getClasses([classes])} {...rest} >
        {rest.children}
    </div>
  )
}

export default Card
