interface StarRatingProps {
    rating: number;
}
import './stars.css';
const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
    return (
        <div className="star-rating">
            <span style={{ width: rating + '%' }}></span>
        </div>
    );
};

export default StarRating;
