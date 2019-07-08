import React, { Component } from 'react'

export default class Colbar extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="ml-2 pt-2">
                    <ul className="category-list">
                        <li className="text-category-title category-item">Common Goods</li>
                        <li className="category-item ml-3">Kitchen Equipment</li>
                        <li className="category-item ml-3">Bathroom Equipment</li>
                        <li className="category-item ml-3">Bedroom Equipment</li>
                    </ul>
                </div>
                <hr></hr>
                <div className="ml-2">
                    <ul className="category-list">
                        <li className="text-category-title category-item">Informatics</li>
                        <li className="category-item ml-3">Books</li>
                        <li className="category-item ml-3">Practical Equipment</li>
                        <li className="category-item ml-3">VR Equipment</li>
                    </ul>
                </div>
                <hr></hr>
                <div className="ml-2 pb-4">
                    <ul className="category-list">
                        <li className="text-category-title category-item">Physics</li>
                        <li className="category-item ml-3">Books</li>
                        <li className="category-item ml-3">Lab Equipment</li>
                    </ul>
                </div>
            </React.Fragment>
        )
    }
}
