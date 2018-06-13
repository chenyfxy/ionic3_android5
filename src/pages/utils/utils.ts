import { item_list } from "../data/itemData";

export const formatDate = ( time: any ) => {
    const Dates = new Date( time );
    const year: number = Dates.getFullYear();
    const month: any = ( Dates.getMonth() + 1 ) < 10 ? '0' + ( Dates.getMonth() + 1 ) : ( Dates.getMonth() + 1 );
    const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
    return year + '/' + month + '/' + day;
  };

export const sortItem = () => {
    let data = item_list;

    const compare = function(obj1, obj2) {
        const id1 = obj1.id;
        const id2 = obj2.id;

        if (id1 < id2) {
            return 1;
        } else if (id1 > id2) {
            return -1;
        } else {
            return 0;
        }  
    }

    data.sort(compare);
};

export const notBlank = (value) => {
    return value != "" && value != undefined;
};