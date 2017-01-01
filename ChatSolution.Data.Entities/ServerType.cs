namespace ChatSolution.Data.Entities
{
    /// <summary>
    /// The server type.
    /// </summary>
    public enum ServerType
    {
        /// <summary>
        /// This is the server type which will be available for consultants.
        /// </summary>
        Backend,

        /// <summary>
        /// This is the server type which will be available for customers.
        /// </summary>
        Frontend,

        /// <summary>
        /// This is the server type which will be available for consultants and customers.
        /// </summary>
        Both
    }
}