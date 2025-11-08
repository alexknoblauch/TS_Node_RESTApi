export const genUsername =  function() {
    const userNamePrefix = 'user-'
    const randomUser = Math.random().toString(36).slice(2)

    const username = userNamePrefix + randomUser
    return username
}


export const genSlug = (title: string): string => {
    const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');

    const randomChars = Math.random().toString(36).slice(2, 8);
    const uniqueSlug = `${slug}-${randomChars}`;

    return uniqueSlug;
};