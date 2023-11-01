import Tilt from 'react-parallax-tilt'
import './Logo.css'
import brain from './brain.png'

const Logo = () => {
    return (
        <div className="ma4 mt0">
            <Tilt className='Tilt br2 shadow-2'>
                <div className='pa3'>
                    <img src={brain} style={{paddingTop: '5px', width: '100%'}} alt="logo" />
                </div>
            </Tilt>
        </div>
    );
}
 
export default Logo;