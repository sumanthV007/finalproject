import React,{ useState,useEffect,useContext } from 'react';
import { search } from "ss-search";
import { NavContext } from '../context/navigationContext';
import { PropertyContext } from '../context/propertyContext';
import ReactLoading from 'react-loading';
import isOnline from '../global/InternetStatus';
import '../css/availableproperty.css'


const PropertyCard = ({item}) => {
  const { title, images, count, price, location} = item;
  return (
    <div className="property_card">
      <div>
        <img src={Object.values(images)[0]} />
      </div>
      <div className="property_card_body">
        <h2>{title}</h2>
        <p>Location : {location.split("=")[0]}</p>
        <div className="property_card_body_subpart">
          <p>{price}</p>
          <p style={{marginLeft:"5rem"}}>Count: {count}</p>
        </div>
      </div>
      
    </div>
  );
}







const Pending_Properties = ()=> {
  //Contexts
  const {  getPropertyBySearchedId,
          getPendingProperties,
           searchListData,
           isLoaded,
           setIsLoaded,
           fetchData,
           availablePayingGuests,
           pendingProperties,
           setAvailablePayingGuests,
           setPayingGuestDetailData,
           setSelectedPayingGuestLocationId
            } = useContext(PropertyContext);
          
  
  const { changeBody,bodyProps } = useContext(NavContext);
  const { CurrentBody } = bodyProps;


  //States
  const [searchedList,setSearchedList] =useState([]);
  const [typedSearchData,setTypedSearchData] = useState('');

  const [isSearching,setIsSearching] = useState(false);
  const [isEmpty,setIsEmpty] = useState(false);

  const [error,setError]= useState(false);



  //Functions
  const handleInputTyped = (value)=>{
    setTypedSearchData(value);
    if(value.length>2)
      setSearchedList(search(searchListData, ["searchText"], value));
    else 
      setSearchedList([]);
    }


    const handleSearching = ()=> {
      if(isOnline()===false){
        setError(true);
        return;
      }
      setError(false);
      setSearchedList([]);
      setAvailablePayingGuests([]);
      setIsEmpty(false);
      const searchedData= search(searchListData, ["searchText"], typedSearchData);
      const similarNameLocation=searchedData.filter(data=> data.searchText===typedSearchData);
      const final_data= similarNameLocation.length===0?searchedData[0]:similarNameLocation[0];
      // if(!final_data || typedSearchData === ''){
      //   setIsEmpty(true);
      //   return;
      // }
      const locationId = final_data.id;
      setIsSearching(true);
      getPendingProperties()
      .then(val=>{
        if(val=== "Empty"){
          setIsSearching(false);
          setIsEmpty(true);
        }
        else{
          setIsSearching(false);
          setSelectedPayingGuestLocationId(locationId);
        }
      })
    }
  

    useEffect(()=>{
      if(isOnline()===true){
        setError(false);
        fetchData(CurrentBody); 
      }
      else{
        setIsLoaded(true);
        setError(true);
      }
    },[CurrentBody]);

  if(!isLoaded)
    return <div className="loading_body_container">
              <div><ReactLoading type="spin" color="#383838"  height={87} width={55} /></div>
          </div>


  return(
      <div>
          <div className="property_search_container">

            <input list="Locations" placeholder="Search by location" type="hidden" 
              className="input property_input" onChange={(e)=> handleInputTyped(e.target.value)}/>
              <datalist id="Locations" >
                  {searchedList.map(item=> <option key={item.id} value={item.searchText} /> )}
              </datalist>


              <button className="button" onClick={handleSearching}>List All</button>
        
  
                {
                  isSearching?
                  <div className="loading_body_container">
                      <div><ReactLoading type="spin" color="#383838"  height={87} width={55} /></div>
                  </div>
                   :
                  null
                }

                {
                  isEmpty?
                  <p className="P no_found_user_text" style={{margin:"auto"}}>No Paying Guest found on that location</p>
                  :
                  null
               }
               {
                  error?
                  <p className="P no_found_user_text" style={{margin:"auto"}}>No Internet Connection Found</p>
                  :
                  null
               }
              
          
          </div>



            { pendingProperties.map(item=>
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a key={item.id} onClick={()=>{
                  setPayingGuestDetailData(item);
                  changeBody("Pending_Property_Detail");
                }}>
                  <PropertyCard item={item} />
                </a>)
            }

            
      </div>
      );
}


export default Pending_Properties;


