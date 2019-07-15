import React, { Component } from 'react';

export default class Colbar extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    searchCat = (e) => {
        const val = (e.target.getAttribute('name'));
        this.props.getCategory(val)
    }

    getCategory = () => {
        let categories = [];

        if (Array.isArray(this.props.categories)) {
            this.props.categories.map((cat) => {
                if (cat !== null) {
                    let subs = [];
                    this.props.subCategories[cat.id].map((sub) => {
                        if(sub !== null){
                            subs.push(<li key={sub.id + sub.title} className="category-item ml-3" style={{cursor:"pointer"}} onClick={this.searchCat} name={cat.id + '-' + sub.id}>{sub.title}</li>)
                        }
                    })
                    let div = <span key={cat.id + cat.title}><div className="ml-2 pt-2">
                        <ul className="category-list">
                            <li key={cat.id + cat.title} className="text-category-title category-item" style={{cursor:"pointer"}} onClick={this.searchCat} name={cat.id + '-*'}>{cat.title}</li>
                            {subs}
                        </ul>
                    </div>
                        <hr></hr>
                    </span>
                    categories.push(div)
                }
            })
        }

        return categories;
    }

    render() {
        return (
            <React.Fragment>
                {this.getCategory()}
            </React.Fragment>
        )
    }
}
