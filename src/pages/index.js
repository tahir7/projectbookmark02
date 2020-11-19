import React, { useEffect, useState } from "react"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import  './styles.css'
import Card from '../components/card';

const GET_BOOKMARKS = gql`
{
    bookmark {
        id
        url
        desc
    }
}
`;

const ADD_BOOKMARK = gql`
    mutation addBookmark($url: String!, $desc: String!){
        addBookmark(url: $url, desc: $desc){
            id
        }
    }
`

export default function Home() {

    let descField;
    let urlField;

    const { error, loading, data } = useQuery(GET_BOOKMARKS);
    const [addBookmark] = useMutation(ADD_BOOKMARK);
    const handleSubmit = () => {
        console.log(descField.value)
        console.log(urlField.value)
        addBookmark({
            variables: {
                url: urlField.value,
                desc: descField.value
            },
            refetchQueries: [{ query: GET_BOOKMARKS }]             
        })        
          urlField.value = ''
          descField.value = ''      
    }

    if (error)
        return <h3>{error}</h3>

    if (loading)
        return <h3>Loading..</h3>

    return <div className="container">

        <h2>Add New Bookmark</h2>
        <label>
            Enter Bookmark Tite: <br />
            <input type="text" ref={node => descField = node} />
        </label>

        <br />
        <label>
            Enter Bookmark Url: <br />
            <input type="text" ref={node => urlField = node} />
        </label>

        <br />
        <br />
        <button onClick={handleSubmit}>Add Bookmark</button>

        <h2>My Bookmark List</h2>
        {/* {JSON.stringify(data.bookmark)} */}

        <div className="card-container">
            {data.bookmark.map((bm) => <Card url={bm.url} desc={bm.desc} key={bm.id} />)}
        </div>

    </div>
}