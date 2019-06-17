import React, { Component } from 'react'

export default class Colbar extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="ml-2 pt-2">
                    <ul className="category-list">
                        <li className="text-category-title category-item">Common Goods</li>
                        <li className="category-item">Kitchen Equipment</li>
                        <li className="category-item">Bathroom Equipment</li>
                        <li className="category-item">Bedroom Equipment</li>
                    </ul>
                </div>
                <hr></hr>
                <div className="ml-2">
                    <ul className="category-list">
                        <li className="text-category-title category-item">Informatics</li>
                        <li className="category-item">Books</li>
                        <li className="category-item">Practical Equipment</li>
                        <li className="category-item">VR Equipment</li>
                    </ul>
                </div>
                <hr></hr>
                <div className="ml-2 pb-4">
                    <ul className="category-list">
                        <li className="text-category-title category-item">Physics</li>
                        <li className="category-item">Books</li>
                        <li className="category-item">Lab Equipment</li>
                    </ul>
                </div>
            </React.Fragment>
        )
    }
}
