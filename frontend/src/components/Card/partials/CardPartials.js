import React from 'react'
import { getClasses } from '../../../utils/getClasses'


const CardHeader = ({classes,titleclasses,...rest}) => {
  return (
    <div className={getClasses([classes])} {...rest}>
        {rest.children}

    </div>
  )
};

const CardBody = ({classes , ...rest}) => {
    return (

          <div className="card-body" {...rest}>

{rest.children}
          </div>

    )
  }



export {CardHeader,CardBody}

