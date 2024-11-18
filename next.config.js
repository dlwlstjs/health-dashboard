module.exports = {
    experimental: {
      middleware: true,
    },  
    async middleware() {
      return {
        matcher: ["/"],
      };
    },
  };

  