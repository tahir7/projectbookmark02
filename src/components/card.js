import React from 'react'
import  '../pages/styles.css'

export default function Card({url, desc}) {

   var a = 'https://'.concat(url);

    return( <div className='card'>
       
        <p className='url'><a className='url' href= {a} target="_blank"> {url}  </a> </p>

        {/* <p className='url'><b> {url} </b></p> */}
        <p className='desc'><b> {desc} </b></p>
    </div>)

}