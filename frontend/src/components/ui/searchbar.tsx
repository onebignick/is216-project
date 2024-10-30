import { ChangeEvent } from "react";

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <input
            type="search"
            placeholder="Search"
            className="border p-2 rounded w-full mb-6"
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
        />
    );
};

export default SearchBar;
