export const verifyHash = (validateData) => {
    if (!validateData.length) {
        return true;
    }

    const regex = /^0x[a-f0-9]{64}$/
    const block = /^0x[a-f0-9]{7}$/
    const fromTo = /^0x[a-f0-9]{40}$/


    if (validateData.hashTransaction && regex.test(validateData.hashTransaction)) {
        return true
    } else if (validateData.block_number && block.test(validateData.block_number)) {
        return true
    } else if (validateData.from && fromTo.test(validateData.from)) {
        return true
    } else if (validateData.to && fromTo.test(validateData.to)) {
        return true
    } else {
        return false
    }
}
