import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';


const SortableItem = SortableElement(({id,num,text,delItemFunction}) => {
	return (
		<div className='item-wrap'>
			<div className='item'>
				<div className='item-num'>{num}</div>
				<div className='item-text'>
					{text}
				</div>
				<div className='item-remove'
					onClick={() => delItemFunction({id})}>
				</div>
			</div>
		</div>
	);
});

const SortableList = SortableContainer(({order,points,delItemFunction}) => {
	return(
		<div className='point-list-overflow'>
			<div className='point-list'>
				{order.map((id, index) => (
					<SortableItem
						key={`item-${id}`}
						index={index}
						id={id}
						num={index + 1}
						text={points[id]}
						delItemFunction={delItemFunction}
					/>
				))}
			</div>
		</div>
	);
});


class PointList extends React.Component {

	order = () => this.props.pointList.order;

	onSortEnd = ({oldIndex, newIndex}) => {
		const newOrderedList = arrayMove(this.order(), oldIndex, newIndex);
		this.props.sagaReorderList({order: newOrderedList});
	};
	shouldCancelStart = (e) => {
		let classList = e.target.classList;
		if (classList.contains('item-remove')) {
			return true;
		};
		return false;
	};
	render(){
		return (
				<SortableList
					lockAxis='y'
					lockToContainerEdges={true}
					helperClass='point-dragging'
					onSortEnd={this.onSortEnd}
					shouldCancelStart={this.shouldCancelStart}
					order={this.order()}
					points={this.props.pointList.points}
					delItemFunction={this.props.sagaDelPoint}
				/>
		);
	};
};

export { SortableItem, SortableList };
export default PointList;

