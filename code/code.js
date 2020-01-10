const registration = (user) => {
    let beCode = {AI, cyber, web};
    beCode.AI = {
        name : 'AI/Data Science',
        duration : '7 months',
        location : 'Charleroi',
        cost : 'free',
        start : 02/03/2020
    }
    return user.like() === AI ? 'https://www.becode.org/AI-school/' : 'https://www.becode.org/';
}
user.motivation > Math.pow(10, 1000) ? registration() : user.exit();
console.log(`Hi ${user}`);