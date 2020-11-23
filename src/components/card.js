import React from 'react'
import  '../pages/styles.css'
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const GET_BOOKMARKS = gql`
{
    bookmark {
        id
        url
        desc
    }
}
`;

const DELETE_BOOKMARK = gql`
    mutation deleteBookmark($id1 : String){
        deleteBookmark(id1: $id1) {
            id1
        }   
    }
`  

export default function Card({id, url, desc}) {

    var myURL = '';

    if( url.includes('https'))
        myURL = url
    else
        myURL = 'https://'.concat(url);
    //    var myURL = url;

    const { error, loading, data } = useQuery(GET_BOOKMARKS);
   const [deleteBookmark] = useMutation(DELETE_BOOKMARK);  


   function delBookmark(id1) {
       console.log('delBookmark -- url: ', url,'  id1:  ',  id1)
        deleteBookmark({
            variables : {id1: id1 }, 
                refetchQueries: [{ query: GET_BOOKMARKS }]
            }
            ) 
                 
   }

    return( <div className='card'>
       
        <p className='url'><a className='url' href= {myURL} target="_blank"> {url}  </a> </p>
        <p className='desc'><b> {desc} </b></p>
        <button onClick = { () =>  delBookmark(id) } > Delete Bookmark  </button>
    </div>)

}