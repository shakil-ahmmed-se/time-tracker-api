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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const setupTestDB_1 = __importDefault(require("../jest/setupTestDB"));
const toJSON_1 = require("../toJSON");
const paginate_1 = __importDefault(require("./paginate"));
const projectSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    milestones: {
        type: Number,
        default: 1,
    },
});
projectSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'project',
});
projectSchema.plugin(paginate_1.default);
projectSchema.plugin(toJSON_1.toJSON);
const Project = mongoose_1.default.model('Project', projectSchema);
const taskSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    project: {
        type: String,
        ref: 'Project',
        required: true,
    },
});
taskSchema.plugin(paginate_1.default);
taskSchema.plugin(toJSON_1.toJSON);
const Task = mongoose_1.default.model('Task', taskSchema);
(0, setupTestDB_1.default)();
describe('paginate plugin', () => {
    describe('populate option', () => {
        test('should populate the specified data fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const project = yield Project.create({ name: 'Project One' });
            const task = yield Task.create({ name: 'Task One', project: project._id });
            const taskPages = yield Task.paginate({ _id: task._id }, { populate: 'project' });
            expect(taskPages.results[0]).toMatchObject({ project: { _id: project._id, name: project.name } });
        }));
    });
    describe('sortBy option', () => {
        test('should sort results in ascending order using createdAt by default', () => __awaiter(void 0, void 0, void 0, function* () {
            const projectOne = yield Project.create({ name: 'Project One' });
            const projectTwo = yield Project.create({ name: 'Project Two' });
            const projectThree = yield Project.create({ name: 'Project Three' });
            const projectPages = yield Project.paginate({}, {});
            expect(projectPages.results).toHaveLength(3);
            expect(projectPages.results[0]).toMatchObject({ name: projectOne.name });
            expect(projectPages.results[1]).toMatchObject({ name: projectTwo.name });
            expect(projectPages.results[2]).toMatchObject({ name: projectThree.name });
        }));
        test('should sort results in ascending order if ascending sort param is specified', () => __awaiter(void 0, void 0, void 0, function* () {
            const projectOne = yield Project.create({ name: 'Project One' });
            const projectTwo = yield Project.create({ name: 'Project Two', milestones: 2 });
            const projectThree = yield Project.create({ name: 'Project Three', milestones: 3 });
            const projectPages = yield Project.paginate({}, { sortBy: 'milestones:asc' });
            expect(projectPages.results).toHaveLength(3);
            expect(projectPages.results[0]).toMatchObject({ name: projectOne.name });
            expect(projectPages.results[1]).toMatchObject({ name: projectTwo.name });
            expect(projectPages.results[2]).toMatchObject({ name: projectThree.name });
        }));
        test('should sort results in descending order if descending sort param is specified', () => __awaiter(void 0, void 0, void 0, function* () {
            const projectOne = yield Project.create({ name: 'Project One' });
            const projectTwo = yield Project.create({ name: 'Project Two', milestones: 2 });
            const projectThree = yield Project.create({ name: 'Project Three', milestones: 3 });
            const projectPages = yield Project.paginate({}, { sortBy: 'milestones:desc' });
            expect(projectPages.results).toHaveLength(3);
            expect(projectPages.results[0]).toMatchObject({ name: projectThree.name });
            expect(projectPages.results[1]).toMatchObject({ name: projectTwo.name });
            expect(projectPages.results[2]).toMatchObject({ name: projectOne.name });
        }));
    });
    describe('limit option', () => {
        const projects = [
            { name: 'Project One', milestones: 1 },
            { name: 'Project Two', milestones: 2 },
            { name: 'Project Three', milestones: 3 },
        ];
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Project.insertMany(projects);
        }));
        test('should limit returned results if limit param is specified', () => __awaiter(void 0, void 0, void 0, function* () {
            const projectPages = yield Project.paginate({}, { limit: 2 });
            expect(projectPages.results).toHaveLength(2);
            expect(projectPages.results[0]).toMatchObject({ name: 'Project One' });
            expect(projectPages.results[1]).toMatchObject({ name: 'Project Two' });
        }));
    });
    describe('page option', () => {
        const projects = [
            { name: 'Project One', milestones: 1 },
            { name: 'Project Two', milestones: 2 },
            { name: 'Project Three', milestones: 3 },
        ];
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Project.insertMany(projects);
        }));
        test('should return the correct page if page and limit params are specified', () => __awaiter(void 0, void 0, void 0, function* () {
            const projectPages = yield Project.paginate({}, { limit: 2, page: 2 });
            expect(projectPages.results).toHaveLength(1);
            expect(projectPages.results[0]).toMatchObject({ name: 'Project Three' });
        }));
    });
    describe('projectBy option', () => {
        const projects = [
            { name: 'Project One', milestones: 1 },
            { name: 'Project Two', milestones: 2 },
            { name: 'Project Three', milestones: 3 },
        ];
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Project.insertMany(projects);
        }));
        test('should exclude a field when the hide param is specified', () => __awaiter(void 0, void 0, void 0, function* () {
            const projectPages = yield Project.paginate({}, { projectBy: 'milestones:hide' });
            expect(projectPages.results[0]).not.toMatchObject({ milestones: expect.any(Number) });
        }));
        test('should exclude multiple fields when the hide param is specified', () => __awaiter(void 0, void 0, void 0, function* () {
            const projectPages = yield Project.paginate({}, { projectBy: 'milestones:hide,name:hide' });
            expect(projectPages.results[0]).not.toMatchObject({ milestones: expect.any(Number), name: expect.any(String) });
        }));
        test('should include a field when the include param is specified', () => __awaiter(void 0, void 0, void 0, function* () {
            const projectPages = yield Project.paginate({}, { projectBy: 'milestones:include' });
            expect(projectPages.results[0]).not.toMatchObject({ name: expect.any(String) });
            expect(projectPages.results[0]).toMatchObject({ milestones: expect.any(Number) });
        }));
        test('should include multiple fields when the include param is specified', () => __awaiter(void 0, void 0, void 0, function* () {
            const projectPages = yield Project.paginate({}, { projectBy: 'milestones:include,name:include' });
            expect(projectPages.results[0]).toHaveProperty('milestones');
            expect(projectPages.results[0]).toHaveProperty('name');
        }));
        test('should always include id when the include param is specified', () => __awaiter(void 0, void 0, void 0, function* () {
            const projectPages = yield Project.paginate({}, { projectBy: 'milestones:include' });
            expect(projectPages.results[0]).not.toMatchObject({ name: expect.any(String) });
            expect(projectPages.results[0]).toMatchObject({ id: expect.any(String), milestones: expect.any(Number) });
        }));
    });
});
//# sourceMappingURL=paginate.test.js.map