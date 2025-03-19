import { Stablecoins } from "./stablecoin-table/Stablecoins";

const StablecoinContent = () => {
    return(
        <>
        <div className='grid gap-5 lg:gap-7.5'>
            <Stablecoins />
        </div>
        </>
    )
};

export {StablecoinContent}