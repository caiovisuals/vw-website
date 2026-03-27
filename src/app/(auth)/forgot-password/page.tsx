export default function ForgotPassword() {
    return (
        <div className="min-h-[75vh] max-h-[calc(100vh-100px)] md:max-h-[calc(100vh-124px)] flex flex-col items-center justify-center bg-gradient-to-br from-[#202020] to-[var(--dark-blue)] px-6 py-6 md:py-10 md:px-12 lg:px-20">
            <form className="w-full max-w-md bg-[var(--white-background)] rounded-2xl p-6 md:p-8 shadow-xl">
                <div className="mb-6">
                    <h1 className="text-4xl font-semibold vw-font">
                        Esqueci minha Senha
                    </h1>
                    <h2 className="text-lg vw-font">
                        Troque a sua senha confirmando sua entrada pelo seu Email
                    </h2>
                </div>
            </form>
        </div>
    )
}