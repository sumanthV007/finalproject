import React,{useContext,useState} from 'react';
import {NavContext } from '../context/navigationContext';
import { PropertyContext } from '../context/propertyContext';
import ReactLoading from 'react-loading';
import '../css/propertydetail.css';
import back from '../img/back.svg';
import edit from '../img/edit3.svg';
import { db } from '../config/firebase';


const ChangeValue = ({ValueChanged,
                      Property,
                      PropertyType,
                      setValueChanged,
                      dataChanged,
                      setNewValue,
                      CurrentValue,
                      persistedValue }) => {

    return (
        <div>
            {ValueChanged? 
            <div>
                <h4>{Property}:</h4>
                <div className="property_value" style={{alignItems:"center"}}>
                    <input className="input" value={CurrentValue} type={PropertyType} placeholder={`Set ${Property}`} onChange={(e)=> setNewValue(e.target.value)}/>
                    <button className="button" 
                    onClick={()=>dataChanged(Property)}>Submit</button>   
                    <button className="button" 
                    onClick={()=>{
                        setNewValue(persistedValue);
                        setValueChanged(false);
                        }}>Cancel</button>   
                </div>
            </div>
            :
            <div>
                <h4>{Property}:</h4>
                <div className="property_value">
                    <p>{CurrentValue}</p>
                    <button className="btn" onClick={()=>setValueChanged(true)} >
                        <img src={edit} className="edit_icon" />
                    </button>
                </div>
            </div>
            }
        </div>
    );
};





const Pending_Property_Detail = ()=> {

    //Contexts
    const { bodyProps,changeBody } = useContext(NavContext);

    const { handleDataModification,
            handleDeleteProperty,
            refreshData,
            refresh,
            removeAreaId,
            payingGuestDetailData,
            AmenityImageUrls,
            handleDeleteAmenities,
            handleAddAmenities } = useContext(PropertyContext);

    const { id,
            count,
            title,
            description,
            location,
            price,
            new_price,
            pendingId,
            ownerPhoneNumber,
            amenities={},
            images={},
            visible,
            videoLink='',
            rating
             } =payingGuestDetailData;


  

    //States

    const [NewPriceChanged, setNewPriceChanged] = useState(false);
    const [newPriceValue, setNewPriceValue] = useState(new_price);

    const [VisibleChanged, setVisibleChanged] = useState(false);
    const [visibleValue, setPropertyVisibleValue] = useState(visible);

    const [CountChanged,setCountChanged]= useState(false);
    const [countValue,setCountValue] = useState(count);

    const [TitleChanged,setTitleChanged]= useState(false);
    const [TitleValue,setTitleValue] = useState(title);

    const [DescriptionChanged,setDescriptionChanged]= useState(false);
    const [DescriptionValue,setDescriptionValue] = useState(description);

    
    const [PriceChanged,setPriceChanged]= useState(false);
    const [PriceValue,setPriceValue] = useState(parseInt(price.split(" ")[1]));

    const [LocationChanged,setLocationChanged] =useState(false);
    const [LocationValue,setLocationValue] = useState(location);

    const [VideoLinkChanged,setVideoLinkChanged] =useState(false);
    const [VideoLinkValue,setVideoLinkValue] = useState(videoLink);

    const [RatingChanged,setRatingChanged] =useState(false);
    const [RatingValue,setRatingValue] = useState(rating);

    const [AmenityChanged,setAmenityChanged] = useState(false);
    const [addedAmenities,setAddedAmenities] = useState([]);
    const [selectedAmenity,setSelectedAmenity] = useState('');

    const [absentAmenities,setAbsentAmenities] = useState([])



    const [dataUpdated,setDataUpdated] = useState(false);
    const [deleting,setDeleting] = useState(false);
    const [deleteText,setDeleteText] =useState('');


    const [errorOccured,setErrorOccured] = useState(false);

    const currentPropertyType= (id.split("/"))[0];



    //functions


    const updateHandler=async (setChangeState)=> {
        setChangeState(false);
        let locationid=removeAreaId(id);
        await refreshData(locationid,currentPropertyType);
        setDataUpdated(true);
        setTimeout(()=>{setDataUpdated(false)},2000);
    }

    const handleError=(setChangeState,setStateValue,previousStateValue)=> {
        setStateValue(previousStateValue);
        setErrorOccured(true);
        setTimeout(()=>{setErrorOccured(false)},2000);
        setChangeState(false);
    }

    const dataChanged =async (type)=> {
        // eslint-disable-next-line default-case
        switch(type){

            case "NewPrice":{
                await handleDataModification("new_price",id,newPriceValue)
                .then(async val => {
                    updateHandler(setNewPriceChanged,false);
                })
                .catch(err=>{
                    handleError(setNewPriceChanged,setNewPriceValue,new_price);
                });

                break;
            }

            case "Visible":{
                await handleDataModification("visible", id, Boolean(visibleValue))
                .then(async val => {
                    updateHandler(setVisibleChanged);
                })
                .catch(err =>{
                    handleError(setVisibleChanged,setPropertyVisibleValue, visible);
                })

                break;
            }
            case "Count": {
                //api
               await handleDataModification("count",id,parseInt(countValue))
                .then(async val => {
                    updateHandler(setCountChanged);
                })
                .catch(err=>{
                    handleError(setCountChanged,setCountValue,count); 
                });
                break;
            }
            case "Title": {
                //api
                await handleDataModification("title",id,TitleValue)
                .then(async val => {
                    updateHandler(setTitleChanged,false);
                })
                .catch(err=>{
                    handleError(setTitleChanged,setTitleValue,title);
                });
                break;
            }
            case "Description": {
                //api
                await handleDataModification("description",id,DescriptionValue)
                .then(async val => {
                    updateHandler(setDescriptionChanged,false);
                })
                .catch(err=>{
                    handleError(setDescriptionChanged,setDescriptionValue,description);
                });
                break;
            }
            case "Price": {
                //api
                await handleDataModification("price",id,`Rs ${PriceValue}`)
                .then(async val => {
                    updateHandler(setPriceChanged,false);
                })
                .catch(err=>{
                    handleError(setPriceChanged,setPriceValue,price);
                });
                break;
            }
            case "Location": {
                //api
                await handleDataModification("location",id,LocationValue)
                .then(async val => {
                    updateHandler(setLocationChanged,false);
                })
                .catch(err=>{
                    handleError(setLocationChanged,setLocationValue,location);
                });
                break;
            }
            case "Video Link": {
                //api
                await handleDataModification("videoLink",id,VideoLinkValue)
                .then(async val => {
                    updateHandler(setVideoLinkChanged,false);
                })
                .catch(err=>{
                    handleError(setVideoLinkChanged,setVideoLinkValue,videoLink);
                });
                break;
            }
            case "Rating": {
                //api
                await handleDataModification("rating",id,RatingValue)
                .then(async val => {
                    updateHandler(setRatingChanged,false);
                })
                .catch(err=>{
                    handleError(setRatingChanged,setRatingValue,rating);
                });
                break;
            }
     
            
        }
    }


    const onDeleteProperty = () => {
        setDeleteText("Deleting Property");
        setDeleting(true);
        handleDeleteProperty(images,id,currentPropertyType)
        .then(val =>{
            var pending_ref = db.ref("pendingProperties/"+pendingId);
            pending_ref.remove().then(console.log("deleted entry from pending properities"));
            setDeleting(false);
            refresh(currentPropertyType);
            changeBody("Pending_Property_Detail");
        }
        );
    }



    
    const handleDeleteSelectedAmentity = (selectedAmenity) => {
        let previousAmenities =[...addedAmenities];
        const newAmenities = previousAmenities.filter(amenity=> amenity!= selectedAmenity);
        setAddedAmenities(newAmenities);
    }

    const handleAddSelectedAmenity = () => {
        if(selectedAmenity != ''){
            setAddedAmenities([...addedAmenities,selectedAmenity]);
            setSelectedAmenity('');
        }
    }



    const handleDeleteAmentity =(image)=> {
        setDeleteText("Deleting Amenity");
        setDeleting(true);
        handleDeleteAmenities(amenities,image,id)
        .then(val=> {
            setAmenityChanged(false);
            setDeleting(false);
        });
    }

    const handleAddAmenity = ()=> {
        setDeleteText("Adding Amenity");
        setDeleting(true);
        handleAddAmenities(amenities,addedAmenities,id)
        .then(val=>{
            setAmenityChanged(false); 
            setAddedAmenities([]);
            setDeleting(false);
        });
    }

    const handleModifyAmenity =()=> {
        let tempAmenities={...AmenityImageUrls};
        setAmenityChanged(true);
        Object.values(amenities).map(element=>
            Object.entries(AmenityImageUrls).map(element2=>{ 
                if(element2[1] === element)
                   delete tempAmenities[element2[0]]
            }
            )
        )
        setAbsentAmenities(tempAmenities);
    }


    const toggleVisibleValue = ()=>{
        if(visibleValue===true){
            setPropertyVisibleValue(false);
            setVisibleChanged(true);
            handleDataModification("visible", id, false)
            .then(async val => {
                updateHandler(setVisibleChanged);
            })
            .catch(err =>{
                handleError(setVisibleChanged,setPropertyVisibleValue, visible);
            })
            document.getElementById("visibleStatus").value = "false";
           
            var pending_ref = db.ref("pendingProperties/"+pendingId);
            pending_ref.set(id).then(console.log("Added to the pending list id: "+id));
            
        }else{
            setPropertyVisibleValue(true);
            setVisibleChanged(true);
            handleDataModification("visible", id, true)
            .then(async val => {
                updateHandler(setVisibleChanged);
            })
            .catch(err =>{
                handleError(setVisibleChanged,setPropertyVisibleValue, visible);
            })
            document.getElementById("visibleStatus").value = "true";

            var pending_ref = db.ref("pendingProperties/"+pendingId);
            pending_ref.remove().then(console.log("deleted entry from pending properities"));
        }

        var split = id.split("/");
        var path = "locationslist/";
        if(split[0]==="payingguest")
            path+="0/"+split[3];
        else
            path+="1/"+split[3];
            console.log(path)
        var ref = db.ref(path);
        let address_list = [];
        ref.once('value', (list)=>{
            if(list.val()!=null){
                address_list = list.val();
                const val = split[5]+","+split[3]+"/"+split[4]+"/"+split[5];
                if(!address_list.includes(val)){
                    address_list.push(val);
                    ref.set(address_list);
                    console.log("Appended: "+address_list);
                }else{
                    console.log("Address already exists in locationslist");
                }
                
            }else{
                address_list.push(split[5]+","+split[3]+"/"+split[4]+"/"+split[5]);
                console.log("Created: "+ address_list);
                ref.set(address_list);
            }
        })

       
       
    }


    const VisibleChangeValue = () => {

        return (
        <div>
        <h4>Visible</h4>
        <div className="property_value" style={{alignItems:"center"}}>
        <p id="visibleStatus">{String(visibleValue)}</p> 
        </div>
        <button className="button" onClick={toggleVisibleValue}>Toggle Verification</button>
        </div>
        
        );
        };


    
    if(deleting)
    return( 
        <div className="loading_body_container">
            <div><ReactLoading type="spin" color="#383838"  height={87} width={55} /></div>
            <br/>
            <p>{deleteText}...</p>
        </div>
    );

    
        return(
            <div>
                
                <div className="back_notification_container">
                    <div className="notification">
                        {
                        dataUpdated ?
                        <p>Data Updated Sucessfully</p>
                        :
                        null
                        }
                    </div>
                    <div className="notification err">
                        {
                        errorOccured ?
                        <p>Some Error Occured</p>
                        :
                        null
                        }
                    </div>
                    <div className="back_btn_container">
                        {
                        <a onClick={()=>
                            changeBody("Pending_Properties")}>
                                <img src={back} />
                        </a>
                        }
                    </div>
                </div>
    
    
    
    
                <div style={{display:"flex"}}>
                    <div className="imageContainer">
                        <div>
                            <img src={Object.values(images)[0]} />
                        </div>
                        <button className="button" onClick={()=>changeBody("Modify_Image_Pending_Property",{"selectedProperty":currentPropertyType})}>View or Delete or Add Images</button>
                    </div>
                    <div>
                        <ChangeValue 
                        ValueChanged={TitleChanged}
                        Property="Title"
                        PropertyType="text"
                        setValueChanged={setTitleChanged}
                        dataChanged={dataChanged}
                        setNewValue={setTitleValue}
                        CurrentValue={TitleValue}
                        persistedValue={title} />
                    
                        <ChangeValue 
                        ValueChanged={CountChanged}
                        Property="Count"
                        PropertyType="number"
                        setValueChanged={setCountChanged}
                        dataChanged={dataChanged}
                        setNewValue={setCountValue}
                        CurrentValue={countValue}
                        persistedValue={count} />
    
                        <ChangeValue 
                        ValueChanged={LocationChanged}
                        Property="Location"
                        PropertyType="text"
                        setValueChanged={setLocationChanged}
                        dataChanged={dataChanged}
                        setNewValue={setLocationValue}
                        CurrentValue={LocationValue}
                        persistedValue={location} />
    
    
    
                        <ChangeValue 
                        ValueChanged={PriceChanged}
                        Property="Price"
                        PropertyType="number"
                        setValueChanged={setPriceChanged}
                        dataChanged={dataChanged}
                        setNewValue={setPriceValue}
                        CurrentValue={PriceValue}
                        persistedValue={price} />

                        <ChangeValue 
                        ValueChanged={NewPriceChanged}
                        Property="NewPrice"
                        PropertyType="text"
                        setValueChanged={setNewPriceChanged}
                        dataChanged={dataChanged}
                        setNewValue={setNewPriceValue}
                        CurrentValue={newPriceValue}
                        persistedValue={new_price} />      
                      
                        <VisibleChangeValue />
                    </div>
                </div>
    
    
                <div className="imageAmenityContainer" style={{textAlign:"center"}}>
                    <h4>Amenities Images</h4>
                
                    <div style={{display:"flex", justifyContent:"center"}} >
                        {Object.values(amenities).map(image=>
                            <div className="amenity_image_container" key={image}>
                                <div>
                                {AmenityChanged?<button className="btn" onClick={()=> handleDeleteAmentity(image)}>X</button>:null}
                                <img src={image} key={image}/>
                                </div>
                            </div>
                                
                        )}
                    </div>
                    
                    {AmenityChanged?
                    <div className="property_amenities_container mb">
                        <input list="amenities" name="amenity"
                        value={selectedAmenity}
                        autoComplete="off"
                        className="input"
                        style={{marginRight:"1rem"}}
                        placeholder="Choose amenities"
                        onChange={(e)=> setSelectedAmenity(e.target.value)}/> 
                        <datalist id="amenities">
                            {Object.keys(absentAmenities).map(element=>
                                <option value={element} />
                            )} 
                            
                        </datalist>
                        <button type="button" className="button" onClick={handleAddSelectedAmenity}>Add Amenity</button>
                        <br />
                        <div style={{display:"flex",alignItems:"center"}}>
                            {
                            addedAmenities.map(element => (
                                <div className="amenityItem" key={element}>
                                    <div class="deleteAmenity" onClick={()=>handleDeleteSelectedAmentity(element)}>X</div>
                                    <p>{element}</p>
                                </div>
                            ))
                            }
                        </div>
                        <div>
                            <button style={{marginTop:"0.5rem",marginRight:"0.5rem"}} className="button" onClick={handleAddAmenity}>Submit</button>
                            <button className="button" onClick={()=>{
                                setAddedAmenities([]);
                                setAmenityChanged(false);
                                }}>Cancel</button>
                        </div>
                
                    </div>
                    :
                    <button className="button" onClick={handleModifyAmenity}>
                    Delete or Add Amenities</button>
                    }
                    
                
                </div>
    
    
                <h4>Id: </h4>
                <p className="property_p">{id}</p>
    
        
    
                <ChangeValue 
                    ValueChanged={VideoLinkChanged}
                    Property="Video Link"
                    PropertyType="text"
                    setValueChanged={setVideoLinkChanged}
                    dataChanged={dataChanged}
                    setNewValue={setVideoLinkValue}
                    CurrentValue={VideoLinkValue}
                    persistedValue={videoLink} />
    
                <ChangeValue 
                    ValueChanged={RatingChanged}
                    Property="Rating"
                    PropertyType="text"
                    setValueChanged={setRatingChanged}
                    dataChanged={dataChanged}
                    setNewValue={setRatingValue}
                    CurrentValue={RatingValue}
                    persistedValue={rating} />
    
    
            <div>
                {DescriptionChanged? 
                <div>
                    <h4>Description:</h4>
                    <div className="property_value" style={{alignItems:"center"}}>
                        <textarea className="input textArea" value={DescriptionValue} type="text" placeholder="Set Description" onChange={(e)=> setDescriptionValue(e.target.value)}/>
                        <button className="button" 
                        onClick={()=>dataChanged("Description")}>Submit</button>   
                        <button className="button" 
                        onClick={()=>{
                            setDescriptionValue(description);
                            setDescriptionChanged(false);
                            }}>Cancel</button>   
                    </div>
                </div>
                :
                <div>
                    <h4>Description:</h4>
                    <div className="property_value">
                        <p>{DescriptionValue}</p>
                        <button className="btn" onClick={()=>setDescriptionChanged(true)}>
                        <img src={edit} className="edit_icon" />
                        </button>
                    </div>
                </div>
                }
                </div>
    
    
                
                <h4>Owner Phone Number: </h4>
                <p className="property_p"> {ownerPhoneNumber}</p>
    
                <button className="button delete_property_btn" onClick={onDeleteProperty}>Delete the property</button>
    
            </div>
        );
    
}


export default Pending_Property_Detail;