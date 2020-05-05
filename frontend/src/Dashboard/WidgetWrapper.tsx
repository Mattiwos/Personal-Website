import React from 'react';


interface Props {
    //interface is used to make entities such as Property conform with
    products?: string[]; //contains all the properies such as html tag
}
  
interface States {

}

export default class WidgetWrapper extends React.Component<Props,States>{

    constructor(props: Props,state: States){
        super(props);

    }


}