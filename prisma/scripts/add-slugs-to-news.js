"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function createSlug(title, id) {
    const baseSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    const uniqueId = id.toString();
    return `${baseSlug}-${uniqueId}`;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const news = yield prisma.news.findMany({ where: { slug: null } });
        for (const item of news) {
            const slug = createSlug(item.title, item.id);
            yield prisma.news.update({
                where: { id: item.id },
                data: { slug },
            });
            console.log(`Updated news id=${item.id} with slug=${slug}`);
        }
    });
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
