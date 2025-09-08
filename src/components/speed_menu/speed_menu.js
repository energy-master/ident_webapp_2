

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { useDispatch } from 'react-redux';
import ConnectedFileuploadbtn from '../Fileuploadbtn.js';
import SearchIcon from '@mui/icons-material/Search';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
const IDentSpeedMenu = ({
    
    actions = [
        { icon: <DriveFolderUploadIcon />, name: 'Connect' },
      { icon: <SearchIcon />, name: 'Search' },
        { icon: <CrisisAlertIcon />, name: 'Detections' },
      ]

}) => {

    const dispatch = useDispatch();
return (
    <SpeedDial
        color='success.main'
        ariaLabel="IDent Menu"
        sx={{ position: 'absolute', bottom: 16, right: 16, color:'success.main' }}
        icon={<SpeedDialIcon />}>
        {/* FabProps={{ 'color': 'secondary' }} */}
        {actions.map((action) => (
            <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() =>  dispatch({type: "WINDOW_SELECT" , payload: action.name })}
            />
        ))}
    </SpeedDial>
)
};
export default IDentSpeedMenu