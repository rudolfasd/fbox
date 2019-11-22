import React from 'react';


class Separator extends React.Component {

    sepBtnClasses = () => {
        let classes = ['sep-btn-del-all'];
        let order = this.props.pointList.order;
        if (order.length === 0){
            classes.push('inactive');
        };
        return classes.join(' ');
    };
    
    delAllPoints = () => {
        let order = this.props.pointList.order;
        if (order.length){
            this.props.sagaDelAllPoints();
        };
    };

    render(){
        return(
            <div className='sep' onClick={this.delAllPoints}>
                <div className='sep-line'></div>
                <div className={this.sepBtnClasses()}></div>
            </div>
        );
    };
};

export default Separator;