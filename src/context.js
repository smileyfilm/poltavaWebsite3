import React, {Component } from 'react';
import items from './data';
const RoomContext = React.createContext();
// <RoomContext.Provider value={}


class RoomProvider extends Component {
    state={
        rooms:[],
        sortedRooms: [],
        featuredRooms: [],
        loading:true,
        heritage:'any',
        capacity:'any',
        musicaltalentrating:0,
        minMusicalTalentRating:0,
        maxMusicalTalentRating:0,
        minSize:0,
        maxSize:0,
        breakfast:false,
        pets:false
    };
    //getData{}

componentDidMount(){
    let rooms = this.formatData(items);
    let featuredRooms = rooms.filter(room => room.featured === true);
    let minMusicalTalentRating = Math.min(...rooms.map(item => item.musicaltalentrating));
    let maxMusicalTalentRating = Math.max(...rooms.map(item => item.musicaltalentrating));
    let maxSize = Math.max(...rooms.map(item => item.size));

        this.setState ({
        rooms,
        featuredRooms,
        sortedRooms:rooms, 
        loading:false,
        musicaltalentrating:minMusicalTalentRating,
        maxMusicalTalentRating,
        maxSize
    });
}

formatData(items){
    let tempItems = items.map(item => {
        let id = item.sys.id
        let images = item.fields.images.map(image=> image.fields.file.url);
        
        let room = {...item.fields, images:images, id}
        return room;


    });
    return tempItems
}

getRoom = (slug) => {
    let tempRooms = [...this.state.rooms];
    const room = tempRooms.find(room => room.slug===slug)
    return room;
}
handleChange = event => {
    const target = event.target
    const value = target.type === 'checkbox'? target.checked:target.value;
    const name = event.target.name;
    this.setState({[name]:value}, this.filterRooms);
};

filterRooms = () => {
    let {
        rooms,heritage,capacity,musicaltalentrating,minSize,maxSize,breakfast,pets
    } = this.state


// all the rooms

let tempRooms = [...rooms];
//transform value
//capacity = parseInt(capacity)
musicaltalentrating = parseInt(musicaltalentrating)

//filter by heritage
console.log("First heritage");
console.log(heritage);
if (heritage !== 'any') {
    tempRooms = tempRooms.filter(room => room.heritage === heritage);
    console.log("New heritage");
    console.log(heritage);
}
else {heritage = 'any';}

//filter by capacity
console.log("First capacity");
console.log(capacity)
if (capacity !== 'any') {
    tempRooms = tempRooms.filter(room => room.capacity === capacity);
    console.log("New capacity")
    console.log(capacity);
}
else {capacity = 'any';}
//filter by musicaltalentrating
console.log("MusicalTalentRating = ", musicaltalentrating);
tempRooms = tempRooms.filter(room => room.musicaltalentrating >= musicaltalentrating);
//filter by size
tempRooms = tempRooms.filter(room => room.size >= minSize && room.size <= maxSize)

//filter by breakfast

if (breakfast) {
    tempRooms = tempRooms.filter(room => room.breakfast === true)
}

//filter by pets 

if (pets) {
    tempRooms = tempRooms.filter(room => room.pets === true)
}

//change state 
this.setState({
    sortedRooms:tempRooms
});

};

    render() {
        return (
        <RoomContext.Provider value={{...this.state, getRoom:this.getRoom,handleChange:this.handleChange }}>
            {this.props.children}
        </RoomContext.Provider>
        
        );
    }
}

const RoomConsumer = RoomContext.Consumer;

export function withRoomConsumer(Component){
    return function ConsumerWrapper(props){
        return (
        <RoomConsumer>
            {value => <Component {...props} context={value} />}
        </RoomConsumer>
        );
    };
}


export{RoomProvider, RoomConsumer, RoomContext}; 







