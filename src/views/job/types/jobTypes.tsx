export type TJob =  {
    id?: number
    title: string,
    location: string,
    description: string,
    requirements: {id?: number, name: string}[]
}

export type TJobError = {title: [string], location: [string], requirements: [string], description: [string]}